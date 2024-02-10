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
  $('.filters button').click(function (event) {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'JSON',
      data: JSON.stringify({ amenities: Object.keys(amenityIds), states: Object.keys(stateIds), cities: Object.keys(cityIds) }),
      success: function (data) {
        let i;
        let newHTML = [];
        for (i = 0; i < data.length; i++) {
          newHTML.push(createHTML(data[i]));
        }
        newHTML = newHTML.join('');
        $('section.places > article').remove();
        $('section.places').append(newHTML);
      }
    });
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
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    type: 'POST',
    contentType: 'application/json',
    data: '{}',
    success: function (data) {
      let i;
      for (i = 0; i < data.length; i++) {
        $('section.places').append(createHTML(data[i]));
      }
    }
  });
