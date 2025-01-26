//function.js
let currentSearchTerm = '';
let fullScreenClock = null;

// Function to fetch time and update clock face
async function fetchTime(zone) {
  const options = { timeZone: zone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const localTime = new Date().toLocaleTimeString('en', options);
  return localTime;
}

// Function to create a clock face
async function createClockFace(city, zone) {
  const time = await fetchTime(zone);

  const clockFace = document.createElement('a');
  clockFace.href = "#";
  clockFace.className = "clock-face";
  clockFace.dataset.city = city;
  clockFace.dataset.zone = zone;

  const container = document.createElement('div');
  container.className = "container";

  const cityName = document.createElement('h2');
  cityName.textContent = city;

  const timeElem = document.createElement('p');
  timeElem.textContent = time;

  container.appendChild(cityName);
  container.appendChild(timeElem);
  clockFace.appendChild(container);

  // Add click event to toggle full screen
  clockFace.addEventListener('click', toggleFullScreen);


  return clockFace;
}

// Function to update all clocks
async function updateWorldClocks() {
  const clockContainer = document.getElementById("box");
  const clocks = [];

  for (const { city, zone } of timezones) {
    const clockHTML = await createClockFace(city, zone);
    clocks.push(clockHTML);
  }

  clockContainer.innerHTML = "";
  clocks.forEach(clock => clockContainer.appendChild(clock));

  // Apply search filter after clocks are updated
  applySearchFilter(currentSearchTerm); // Maintain search results after updating

  // Reapply full-screen mode if needed
  if (fullScreenClock) {
    const clockToMakeFullScreen = document.querySelector(`.clock-face[data-city="${fullScreenClock.dataset.city}"]`);
    fullScreenClock.addEventListener('click', minimizeFullScreen);

    if (clockToMakeFullScreen) {
      clockToMakeFullScreen.classList.add('full-screen');
    }
  }

  // Update local time display
  const { DateTime } = luxon;
  const now = DateTime.now();
  const timely = document.querySelector('.local-time');
  timely.innerHTML = now.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
}

// Function to apply search filter
function applySearchFilter(searchTerm) {
  const clocks = document.querySelectorAll('.clock-face');

  clocks.forEach(clock => {
    const city = clock.dataset.city.toLowerCase();
    if (city.includes(searchTerm)) {
      clock.style.display = 'flex';
    } else {
      clock.style.display = 'none';
    }
  });
}

// Function to toggle full screen for a clock face
function toggleFullScreen(event) {
  event.preventDefault();
  const clockFace = event.currentTarget;

  if (fullScreenClock === clockFace) {
    minimizeFullScreen();
  } else {
    if (fullScreenClock) {
      fullScreenClock.classList.remove('full-screen');
    }
    clockFace.classList.add('full-screen');
    document.querySelector('.full-screen-overlay').style.display = 'block';
    document.body.classList.add('no-interaction');
    fullScreenClock = clockFace;
  }
}

// Function to minimize full screen clock with transition
function minimizeFullScreen(event) {
  event.preventDefault();
  const clockFace = event.currentTarget;
  if (fullScreenClock) {
    fullScreenClock.classList.remove('full-screen');
    document.querySelector('.full-screen-overlay').style.display = 'none';
    document.body.classList.remove('no-interaction');
    fullScreenClock = null;
  }
}

// Initialize clocks and set intervals for updates
updateWorldClocks();
setInterval(updateWorldClocks, 1000);

// Handle search functionality
document.getElementById('searchButton').addEventListener('click', function() {
  currentSearchTerm = document.getElementById('searchInput').value.toLowerCase(); // Update global search term
  applySearchFilter(currentSearchTerm); // Apply filter
});

const blob = document.getElementById("blob");

document.body.onpointermove = event => {
  const { clientX, clientY } = event;

  blob.animate({
    left: `${clientX}px`,
    top: `${clientY}px`
  }, { duration: 3000, fill: "forwards"});
}
