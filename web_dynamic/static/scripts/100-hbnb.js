const apiUrl = 'http://0.0.0.0:5001/api/v1/status/';
let amenitiesID = [];
let amenitiesText = [];
let stateId = [];
let stateName = [];
let cityName = [];
let cityId = [];

$(document).ready(function () {
  // Make sure checkboxes are unchecked
  $('.locations input[type="checkbox"]').prop('checked', false);
  $('.amenities input[type="checkbox"]').prop('checked', false);

  // Store selected amenities checkboxes
  $('.amenities input[type="checkbox"').change(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).closest('li').text();
    if (this.checked) {
      amenitiesID.push(amenityId);
      amenitiesText.push(amenityName);
    } else {
      amenitiesID = amenitiesID.filter(item => item !== amenityId);
      amenitiesText = amenitiesText.filter(item => item !== amenityName);
    }

    updateAmenitiesH4();
  });

  // Store selected states or cities checkboxes
  $('.locations input[type="checkbox"').change(function () {
    const scID = $(this).data('id');
    const scName = $(this).data('name');
    if ($(this).next('h2').length) {
      if (this.checked) {
        stateId.push(scID);
        stateName.push(scName);
      } else {
        stateId = stateId.filter(item => item !== scID);
        stateName = stateName.filter(item => item !== scName);
      }
    } else {
      if (this.checked) {
        cityId.push(scID);
        cityName.push(scName);
      } else {
        cityId = cityId.filter(item => item !== scID);
        cityName = cityName.filter(item => item !== scName);
      }
    }
    updateStateCityH4();
  });

  // check the api status
  $.get(apiUrl, function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  })
    .fail(function (error) {
      console.error('Error fetching characater details:', error);
    });

  // Show all available places
  fetch('http://0.0.0.0:5001/api/v1/places_search/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  })
    .then(response => response.json())
    .then(data => {
      // Get the section with class 'places' from the DOM
      const placesSection = $('section.places');

      data.forEach(place => {
        const article = document.createElement('article');

        // construct the HTML
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

  // Filters
  $('button').click(function () {
    // set up the JSON object for posting
    const postData = {
      amenities: amenitiesID,
      states: stateId,
      cities: cityId
    };
    // Request the JSON object from the api endpoint
    fetch('http://0.0.0.0:5001/api/v1/places_search/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
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
        });
      })
      .catch(error => console.error('Error:', error));
  });
});

// Show the selected amenities in the popover section
function updateAmenitiesH4 () {
  const amenityH4 = $('.amenities h4');
  const amenitiesStr = amenitiesText.join(', ');

  amenityH4.text(amenitiesStr);
}

// Show the selected states or cities in the popover section
function updateStateCityH4 () {
  let combined = '';
  const locationsH4 = $('.locations h4');
  const stateStr = stateName.join(', ');
  const cityStr = cityName.join(', ');
  if (stateStr && cityStr) {
    combined = stateStr + ', ' + cityStr;
  } else if (stateStr) {
    combined = stateStr;
  } else {
    combined = cityStr;
  }
  locationsH4.text(combined);
}
