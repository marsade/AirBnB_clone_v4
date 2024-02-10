let api_url = 'http://0.0.0.0:5001/api/v1/status/';
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
  $.get(api_url, function (data){
    if (data.status == 'OK') {
      $('#api_status').addClass('available')
    } else {
      $('#api_status').removeClass('available')
    }
  })
  .fail(function (error){
    console.error('Error fetching characater details:', error);
  })

  fetch('http://0.0.0.0:5001/api/v1/places_search/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  })
    .then(response => response.json())
    .then(data => {
      // Get the section with class 'places' from the DOM
      const placesSection = document.querySelector('section.places');

      data.forEach(place => {
        const article = document.createElement('article');

        article.innerHTML = `
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
          <div class="description">${place.description}</div>
        `;

        // Append the article tag to the places section
        placesSection.appendChild(article);
      });
    })
    .catch(error => console.error('Error:', error));
});

function updateAmenitiesH4() {
  let amenity_h4 = $('.amenities h4');
  let amenities_str = amenities_op.join(', ');

  amenity_h4.text(amenities_str);
}
