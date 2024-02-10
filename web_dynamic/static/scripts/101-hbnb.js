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

