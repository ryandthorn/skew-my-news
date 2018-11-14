'use strict';

// Database of ids for News API sources
const newsSources = [
  {
    id: 'abc-news',
    bias: ['center-left']
  },
  {
    id: 'associated-press',
    bias: ['center']
  },
  {
    id: 'bbc-news',
    bias: ['center']
  },
  {
    id: 'bloomberg',
    bias: ['center']
  },
  {
    id: 'breitbart-news',
    bias: ['right']
  },
  {
    id: 'cbs-news',
    bias: ['center-left']
  },
  {
    id: 'cnbc',
    bias: ['center']
  },
  {
    id: 'cnn',
    bias: ['left', 'center-left']
  },
  {
    id: 'msnbc',
    bias: ['left']
  },
  {
    id: 'nbc-news',
    bias: ['center-left']
  },
  {
    id: 'reuters',
    bias: ['center']
  },
  {
    id: 'the-american-conservative',
    bias: ['center-right']
  },
  {
    id: 'the-economist',
    bias: ['center-left']
  },
  {
    id: 'the-hill',
    bias: ['center']
  },
  {
    id: 'the-huffington-post',
    bias: ['left']
  },
  {
    id: 'national-review',
    bias: ['right']
  },
  {
    id: 'the-new-york-times',
    bias: ['left', 'center-left']
  },
  {
    id: 'the-wall-street-journal',
    bias: ['center', 'center-right']
  },
  {
    id: 'the-washington-post',
    bias: ['center-left']
  },
  {
    id: 'the-washington-times',
    bias: ['center-right']
  },
  {
    id: 'usa-today',
    bias: ['center']
  }
];

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function generateSourceValue(bias) {
  return newsSources
    .filter(source => source.bias.indexOf(bias) > -1)
    .map(source => source.id)
    .join(',');
}

function getNews(searchQuery, sliderVal) {
  const params = {
    q: searchQuery,
  };
  
  if (sliderVal === '0') {
    params.sources = generateSourceValue('left');
  } else if (sliderVal === '1') {
    params.sources = generateSourceValue('center-left');
  } else if (sliderVal === '2') {
    params.sources = generateSourceValue('center');
  } else if (sliderVal === '3') {
    params.sources = generateSourceValue('center-right');
  } else if (sliderVal === '4'){
    params.sources = generateSourceValue('right');
  }

  const queryParams = formatQueryParams(params)
  const url = `https://newsapi.org/v2/top-headlines?${queryParams}`;
  
  // Exposing API key in source code might be a problem
  const options = {
    headers: new Headers({
      "X-Api-Key": "e8461a1257724e9c8b77b3e8cdbc5af1"})
  };

  fetch(url, options)
    .then(response => response.json())
    .then(responseJson => displayResults(responseJson));
}

function displayResults(res) {
  $('#js-results').empty();

  if (res.articles.length === 0) {
    $('section').append(`<p>No results found</p>`);
  }

  for (let i = 0; i < res.articles.length; i++) {
    $('#js-results').append(`
      <li>
        <h3>${res.articles[i].title}</h3>
        <p>Source: ${res.articles[i].source.name}</p>
        <p>${res.articles[i].description}</p>
        <a href="${res.articles[i].url}">Full text</a>
      </li>
      <hr>
    `);
  }
  $('section').removeClass('hidden');
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