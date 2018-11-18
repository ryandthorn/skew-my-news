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

function reduceSourceValue(input) {
  return newsSources.reduce((acc, cur) => {
      const check = cur.bias.find(elem => elem === input);
      if (check !== undefined) {
        const comma = acc !== '' ? ',' : '';
        acc += comma + cur.id; 
      }
      return acc 
    }, '');
}

function getNews(searchQuery, sliderVal) {
  const params = {
    q: searchQuery,
  };
  
  if (sliderVal === '0') {
    params.sources = reduceSourceValue('left');
  } else if (sliderVal === '1') {
    params.sources = reduceSourceValue('center-left');
  } else if (sliderVal === '2') {
    params.sources = reduceSourceValue('center');
  } else if (sliderVal === '3') {
    params.sources = reduceSourceValue('center-right');
  } else if (sliderVal === '4'){
    params.sources = reduceSourceValue('right');
  }

  const queryParams = formatQueryParams(params);
  const url = `https://newsapi.org/v2/top-headlines?${queryParams}`;
  
  // Exposing API key in source code might be a problem
  const options = {
    headers: new Headers({
      "X-Api-Key": "e8461a1257724e9c8b77b3e8cdbc5af1"})
  };

  fetch(url, options)
    .then(response => response.json())
    .then(responseJson => displayResults(responseJson, sliderVal));
}

function displayResults(res, sliderVal) {
  $('#js-results').empty();

  if (res.articles.length === 0) {
    $('#js-results').append(`<li>No results found</li>`);
  }

  for (let i = 0; i < res.articles.length; i++) {
    $('#js-results').append(`
      <li>
        <h3>${res.articles[i].title}</h3>
        <p><strong>${res.articles[i].source.name}</strong></p>
        <p>${res.articles[i].description}</p>
        <a href="${res.articles[i].url}">Read more</a>
      </li>
      <hr>
    `);
  }

  if (sliderVal === '0') {
    $("h3").css("color", "#0200a2");
  } else if (sliderVal === '1') {
    $("h3").css("color", "#0c50fc");
  } else if (sliderVal === '2') {
    $("h3").css("color", "#3d3d3d");
  } else if (sliderVal === '3') {
    $("h3").css("color", "#e21218");
  } else if (sliderVal === '4'){
    $("h3").css("color", "#a00106");;
  }

  $('#js-results').removeClass('hidden');
} 

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    let searchQuery = $('#js-search').val();
    let sliderVal = $('#js-slider').val();
    getNews(searchQuery, sliderVal);
  });

  $('input[type=range]').on('input', function() {
    let searchQuery = $('#js-search').val();
    let sliderVal = $('#js-slider').val();
    getNews(searchQuery, sliderVal);
  })
}

$(watchForm);