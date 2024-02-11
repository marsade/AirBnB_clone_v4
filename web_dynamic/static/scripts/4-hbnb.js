
let api_url = 'http://0.0.0.0:5001/api/v1/status/';
let amenities_op = [];
let amenities_text = [];

$(document).ready(function() {
  $('input[type="checkbox"').change(function() {
    let amenity_id = $(this).data('id');
    let amenity_name = $(this).closest('li').text();
    if (this.checked) {
      amenities_op.push(amenity_id);
      amenities_text.push(amenity_name);
    } else {
      amenities_op = amenities_op.filter(item => item !== amenity_id);
      amenities_text = amenities_text.filter(item => item !== amenity_name);
    }

    updateAmenitiesH4()
  });

  // check the api status
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
      const placesSection = $('section.places');

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
          </div>
          <div class="description">${place.description}</div>
        `;

        // Append the article tag to the places section
        placesSection.append(article);
      });
    })
    .catch(error => console.error('Error:', error));

  $('button').click(function (){
    // set up the JSON object for posting
    const post_data = {
      amenities: amenities_op,
    };
    fetch('http://0.0.0.0:5001/api/v1/places_search/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post_data),
    })
      .then(response => response.json())
      .then(data => {
        const placesSection = document.querySelector('section.places');
        placesSection.innerHTML = '';
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
            </div>
            <div class="description">${place.description}</div>
          `;
  
          // Append the article tag to the places section
          placesSection.append(article);
        })
        console.log('Updated HTML:', placesSection.innerHTML);
    })
    .catch(error => console.error('Error:', error));
  });
});

// Show the selected amenities in the popover section
function updateAmenitiesH4() {
  let amenity_h4 = $('.amenities h4');
  let amenities_str = amenities_text.join(', ');

  amenity_h4.text(amenities_str);
}
