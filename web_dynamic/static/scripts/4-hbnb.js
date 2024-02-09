$(function () {
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
      data: JSON.stringify({ amenities: Object.keys(amenityIds) }),
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
