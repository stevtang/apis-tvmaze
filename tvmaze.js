"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const TVMAZE_BASEURL = 'http://api.tvmaze.com/';
const MISSING_URL = `https://tinyurl.com/tv-missing`;

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let response = await axios.get(`${TVMAZE_BASEURL}search/shows/?`, {
    params: { q: term },
  });
  console.log("response: ", response);
  let showInfo = [];

  //Iterate through each show object to get necessary data and store in new object which will go to array.
  for (let showIndex in response.data) {
    let showObject = {};
    showObject["id"] = response.data[showIndex].show.id;
    showObject["name"] = response.data[showIndex].show.name;
    showObject["summary"] = response.data[showIndex].show.summary;

    //If there's no image, it will set as default 'missing' image.
    if (response.data[showIndex].show.image === null) {
      showObject["image"] = MISSING_URL;
    } else {
      showObject["image"] = response.data[showIndex].show.image.medium;
    }

    console.log("showObject: ", showObject);
    showInfo.push(showObject);
  }
  return showInfo;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  //Iterate through array of shows to populate every show found in search.
  for (let show of shows) {
    //Populate DOM with information from show object(id, image, name, summary).
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="${show.name}" 
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();

  populateShows(shows);
}

/** Once button 'search' is clicked, shows will be searched and displayed. */
$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
