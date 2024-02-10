let url = 'http://0.0.0.0:5001/api/v1/status/';
let amenities_op = [];
$(document).ready(function() {
  $('input[type="checkbox"').change(function() {
    let amenity_id = $(this).closest('li').text();
    if (this.checked) {
      amenities_op.push(amenity_id);
    } else {
      amenities_op = amenities_op.filter(item => item !== amenity_id);
    }

    updateAmenitiesH4()
  });
  $.get(url, function (data){
    if (data.status == 'OK') {
      $('#api_status').addClass('available')
    } else {
      $('#api_status').removeClass('available')
    }
  })
  .fail(function (error){
    console.error('Error fetching characater details:', error);
  })
});

function updateAmenitiesH4() {
  let amenity_h4 = $('.amenities h4');
  let amenities_str = amenities_op.join(', ');

  amenity_h4.text(amenities_str);
}
