'use strict';

function getNews(searchQuery, sliderVal) {
  console.log(`Searched for ${searchQuery} & Slider value = ${sliderVal}`);
  // Hard-coded endpoint for development
  const url = "https://newsapi.org/v2/everything?q=bitcoin&from=2018-10-13&sortBy=publishedAt";
  
  // Exposing API key in source code might be a problem
  const options = {
    headers: new Headers({
      "X-Api-Key": "e8461a1257724e9c8b77b3e8cdbc5af1"})
  };

  fetch(url, options)
    .then(response => response.json())
    .then(responseJson => console.log(responseJson));
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    let searchQuery = $('#js-search').val();
    let sliderVal = $('#js-slider').val();
    getNews(searchQuery, sliderVal);
  });
}

$(watchForm);