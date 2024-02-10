$(function () {
  const stateIds = {};
  let stateNames = '';
  $('.states input').change(function (event) {
    if (this.checked) {
      stateIds[this.dataset.id] = this.dataset.name;
    } else {
      delete stateIds[this.dataset.id];
    }
    const names = Object.values(stateIds);
    stateNames = (names.join(', '));
    updateH4();
  });
  
  const cityIds = {};
  let cityNames = '';
  $('.cities input').change(function (event) {
    if (this.checked) {
      cityIds[this.dataset.id] = this.dataset.name;
    } else {
      delete cityIds[this.dataset.id];
    }
    const names = Object.values(cityIds);
    cityNames = names.join(', ');
    updateH4();
  });

    function updateH4 () {
    if (stateNames.length > 0 && cityNames.length > 0) {
      $(' .locations h4').text(stateNames + ', ' + cityNames);
    } else {
      $(' .locations h4').text(stateNames + cityNames);
    }
  }
  const amenityIds = {};
  $('.amenities .popover li input').change(function (event) {
    if (this.checked) {
      amenityIds[this.dataset.id] = this.dataset.name;
    } else {
      delete amenityIds[this.dataset.id];
    }
    const names = Object.values(amenityIds);
    $('.amenities h4').text(names.join(', '));
  });
  
  $('.filters button').click(function () {
    const filters = JSON.stringify(
      {
        amenities: Object.keys(amenityIds),
        states: Object.keys(stateIds),
        cities: Object.keys(cityIds)
      });
    renderPlaces(filters);
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    success: function (data) {
      console.log(data.status);
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    }
  });

  function generateReviewHTML (review) {
    window.fetch(`http://0.0.0.0:5001/api/v1/users/${review.user_id}`)
      .then((res) => res.json())
      .then((data) => `${data.first_name} ${data.last_name}`)
      .then((fullName) => {
        return (
        `<li style="list-style-type:none;">
          <h3>From ${fullName} on ${review.created_at}</h3>
          <p>${review.text}</p>
        </li>`
        );
      })
      .then((genReview) => ($(`#${review.place_id}`).append(genReview)));
  }

  function renderReviews () {
    $('.showreviews').off('click');
    $('.showreviews').click(function (event) {
      const placeId = this.dataset.placeid;
      if ($(`.${placeId}`).text() === 'hide') {
        $(`.${placeId}`).text('show');
        $(`#${placeId} > li`).remove();
      } else {
        $(`.${placeId}`).text('hide');
        window.fetch(`http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`)
          .then((response) => response.json())
          .then((data) => {
            data.forEach(review => {
              generateReviewHTML(review);
            });
          });
      }
    });
  }

  function renderPlaces (filters = '{}') {
    $('section.places > article').remove();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: filters
    };
    window.fetch('http://0.0.0.0:5001/api/v1/places_search', options)
      .then((res) => res.json())
      .then((data) => {
        let i;
        for (i = 0; i < data.length; i++) {
          $('section.places').append(createHTML(data[i]));
        }
      })
      .then(() => renderReviews());
  }

  renderPlaces();

  function createHTML (place) {
    return (
      `<article>

        <div class="title">

        <h2>${place.name}</h2>

        <div class="price_by_night" style="min-width: 70px">

      $${place.price_by_night}

          </div>
        </div>
        <div class="information">
          <div class="max_guest">
        <i class="fa fa-users fa-3x" aria-hidden="true"></i>

        <br />

        ${place.max_guest} Guests

          </div>
          <div class="number_rooms">
        <i class="fa fa-bed fa-3x" aria-hidden="true"></i>

        <br />

        ${place.number_rooms} Bedrooms
          </div>
          <div class="number_bathrooms">
        <i class="fa fa-bath fa-3x" aria-hidden="true"></i>

        <br />

        ${place.number_bathrooms} Bathroom

          </div>
        </div>

        <div class="user">


        </div>

        <div class="description">

          ${place.description}

      </div>
      <div class="reviews">
        <h2>Reviews</h2>
        <span data-placeid=${place.id} class="showreviews ${place.id}" style="margin-left: 177px">show</span>
          <ul class="reviewitems" id="${place.id}">
          </ul>
       </div>
      </article>`);
  }
});
