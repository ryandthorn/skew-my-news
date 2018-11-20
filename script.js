'use strict';

// Database for News API sources
const newsSources = [
  {
    displayName: 'ABC News',
    id: 'abc-news',
    bias: ['center-left']
  },
  {
    displayName: 'Associated Press',
    id: 'associated-press',
    bias: ['center']
  },
  {
    displayName: 'BBC News',
    id: 'bbc-news',
    bias: ['center']
  },
  {
    displayName: 'Bloomberg',
    id: 'bloomberg',
    bias: ['center']
  },
  {
    displayName: 'Breitbart News',
    id: 'breitbart-news',
    bias: ['right']
  },
  {
    displayName: 'CBS News',
    id: 'cbs-news',
    bias: ['center-left']
  },
  {
    displayName: 'CNBC',
    id: 'cnbc',
    bias: ['center']
  },
  {
    displayName: 'CNN',
    id: 'cnn',
    bias: ['left', 'center-left']
  },
  {
    displayName: 'MSNBC',
    id: 'msnbc',
    bias: ['left']
  },
  {
    displayName: 'National Review',
    id: 'national-review',
    bias: ['right']
  },
  {
    displayName: 'NBC News',
    id: 'nbc-news',
    bias: ['center-left']
  },
  {
    displayName: 'Reuters',
    id: 'reuters',
    bias: ['center']
  },
  {
    displayName: 'The American Conservative',
    id: 'the-american-conservative',
    bias: ['center-right']
  },
  {
    displayName: 'The Economist',
    id: 'the-economist',
    bias: ['center-left']
  },
  {
    displayName: 'The Hill',
    id: 'the-hill',
    bias: ['center']
  },
  {
    displayName: 'The Huffington Post',
    id: 'the-huffington-post',
    bias: ['left']
  },
  {
    displayName: 'The New York Times',
    id: 'the-new-york-times',
    bias: ['left', 'center-left']
  },
  {
    displayName: 'The Wall Street Journal',
    id: 'the-wall-street-journal',
    bias: ['center', 'center-right']
  },
  {
    displayName: 'The Washington Post',
    id: 'the-washington-post',
    bias: ['center-left']
  },
  {
    displayName: 'The Washington Times',
    id: 'the-washington-times',
    bias: ['center-right']
  },
  {
    displayName: 'USA Today',
    id: 'usa-today',
    bias: ['center']
  }
];

// Utility functions
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function generateSourceString(bias) {
  return newsSources.reduce((acc, cur) => {
      const check = cur.bias.find(elem => elem === bias);
      if (check !== undefined) {
        const comma = acc !== '' ? ',' : '';
        acc += comma + cur.id; 
      }
      return acc; 
    }, '');
}

function populateSources(bias) {
  $('#source-list > ul').empty()

  const sourceArray = newsSources.reduce((acc, cur) => {
    let check = cur.bias.find(elem => elem === bias);
    if (check) {
      acc.push(cur.displayName);
    } 
    return acc;
  }, []);
  
  sourceArray.forEach(source => {
    $('#source-list > ul').append(`
      <li>${source}</li>
    `)
  })
}

function generateAbout() {
  $('footer').append(`
  <h2>About</h2>
  <p>This web app queries the <a href="https://newsapi.org" target="_blank">News API</a> to search for top headlines within a selected range of sources organized by ideological bias.</p>
  <p>Bias of each source determined by <a href="https://www.allsides.com/media-bias/media-bias-ratings" target="_blank">AllSides Media Bias Ratings</a>.</p>
  <p>Click on these tabs to see which sources correspond to each bias:</p>
  <section id="js-sources">
    <div id="js-tabs">
      <div class="tab" id="blue"></div>
      <div class="tab" id="lightblue"></div>
      <div class="tab" id="grey"></div>
      <div class="tab" id="lightred"></div>
      <div class="tab" id="red"></div>
    </div>
    <div id="source-list">
      <ul class="hidden"></ul>
    </div>
  </section>
  <p>Copyright &copy; 2018 Ryan Thorn for Thinkful</p>
  `);
}

function generateResults(res) {
  for (let i = 0; i < res.articles.length; i++) {
    $('#js-results').append(`
      <li>
        <h3>${res.articles[i].title}</h3>
        <p><strong>${res.articles[i].source.name}</strong></p>
        <p>${res.articles[i].description}</p>
        <a href="${res.articles[i].url}" target="_blank">Source</a>
      </li>
      <hr>
    `);
  }
}

function determineBias(params, sliderVal) {
  if (sliderVal === '0') {
    params.sources = generateSourceString('left');
  } else if (sliderVal === '1') {
    params.sources = generateSourceString('center-left');
  } else if (sliderVal === '2') {
    params.sources = generateSourceString('center');
  } else if (sliderVal === '3') {
    params.sources = generateSourceString('center-right');
  } else if (sliderVal === '4'){
    params.sources = generateSourceString('right');
  }
}

function setHeadlineColor(sliderVal) {
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
}

function displayResults(res, sliderVal) {
  $('#js-results').empty();

  generateResults(res);
  setHeadlineColor(sliderVal);

  $('#js-results').removeClass('hidden');
} 

// Get articles from News API based on user input
function getNews(searchQuery, sliderVal) {
  const params = {
    q: searchQuery,
  };

  // Choose which sources to query
  determineBias(params, sliderVal);
  
  // Create URL and header for fetch
  const queryParams = formatQueryParams(params);
  const url = `https://newsapi.org/v2/top-headlines?${queryParams}`;
  const options = {
    headers: new Headers({
      "X-Api-Key": "e8461a1257724e9c8b77b3e8cdbc5af1"})
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      // If 'top headlines' returns no results, query the 'everything' endpoint
      if (responseJson.totalResults === 0) {
        const everythingEndpoint = `https://newsapi.org/v2/everything?${queryParams}`;
        fetch(everythingEndpoint, options)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(response.statusText);
          })
          .then(responseJson => displayResults(responseJson, sliderVal));
      }
      // Otherwise display top headlines
      displayResults(responseJson, sliderVal);
    });
}

// Event handlers
function initEventHandlers() {
  buttonHandler();
  sliderHandler();
  headerHandler();
  footerHandler();
}

function buttonHandler() {
  $('form').submit(event => {
    event.preventDefault();
    let searchQuery = $('#js-search').val();
    let sliderVal = $('#js-slider').val();
    getNews(searchQuery, sliderVal);
    // Reset footer
    $('footer').empty();
    $('footer').append(`<h2>About</h2>`);
    footerHandler();
  });
}

function sliderHandler() {
  $('input[type=range]').on('input', function() {
    let searchQuery = $('#js-search').val();
    let sliderVal = $('#js-slider').val();
    getNews(searchQuery, sliderVal);
    // Reset footer
    $('footer').empty();
    $('footer').append(`<h2>About</h2>`);
    footerHandler();
  })
}

function headerHandler() {
  // Return to 'home' state
  $('h1').click(() => {
    $('#js-results').addClass('hidden');
    $('footer').empty();
    $('footer').append(`<h2>About</h2>`);
    footerHandler();
  });
}

function footerHandler() {
  $('h2').click(event => {
    $('#js-results').addClass('hidden');
    $('footer').empty();
    generateAbout();

    // Handle tab changes
    $('.tab').click(event => {
      let elem = $(event.target);
      $('#source-list ul').removeClass('hidden')
      $('.tab').removeClass('active-tab');
      elem.addClass('active-tab');
      
      if ( elem.is("#blue") ) {
        populateSources('left');
      } else if ( elem.is("#lightblue") ) {
        populateSources('center-left');
      } else if ( elem.is("#grey") ) {
        populateSources('center');
      } else if ( elem.is("#lightred") ) {
        populateSources('center-right');
      } else if ( elem.is("#red") ){
        populateSources('right');
      }
    });
  });
}

$(initEventHandlers);