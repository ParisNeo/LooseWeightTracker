// Load the ShapeTracker object from local storage
const ShapeTracker = JSON.parse(localStorage.getItem("ShapeTracker"));
const storedSchedule = ShapeTracker.schedule;
// Get the instances of each element
const todayLink = document.getElementById("today");
const addLink = document.getElementById("add");
const progressLink = document.getElementById("progress");
const exportLink = document.getElementById("export");
const importLink = document.getElementById("import");

/**

  Deletes all data from local storage.
  This action cannot be undone.
*/
function deleteAllData() {
    if (confirm("Are you sure you want to delete all data? This action cannot be undone.")) {
      localStorage.clear();
      window.location.href = "index.html";
    }
  }
/**

  Converts a time string (e.g. "07:00") to a Date object with the current year, month, and day.
  @param {string} timeString - The time string to convert.
  @returns {Date} The Date object created from the time string.
*/
function convertTimeStringToDate(timeString) {
  // Split the time string at the colon
  const parts = timeString.split(':');
  // Convert the hours and minutes to integers
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  // Get the current date
  const now = new Date();
  // Set the year, month, and day of the new Date object to the current values
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  return date;
}
  
/**

  Calculates the duration between two times in minutes.
  @param {string} startTime - The start time in the format "HH:MM".
  @param {string} endTime - The end time in the format "HH:MM".
  @return {number} The duration in minutes.
*/
  function calculateDuration(startTime, endTime) {
    // Convert the start and end times to Date objects
    const start = new Date('1970-01-01T' + startTime + 'Z');
    let end = new Date('1970-01-01T' + endTime + 'Z');
  
    // If the end time is earlier than the start time, add 1440 (the number of minutes in a day) to the end time
    if (end < start) {
      end = new Date(end.getTime() + 1440 * 60 * 1000);
    }
  
    // Calculate the duration in minutes
    const duration = (end - start) / 1000 / 60;
  
    // Return the duration
    return duration;
  }

/**

  Prepares an array of items from the current day's schedule.
  @param {Object} currentDaySchedule - The current day's schedule.
  @return {Array} The array of items.
*/
  function prepare_items(currentDaySchedule){
    const items = [];
    for (const activity of currentDaySchedule.activity) {
        items.push({
          type: 'activity',
          name: activity.name,
          start_time: activity.start_time,
          end_time: activity.end_time
        });
      }
      
    for (const meal of currentDaySchedule.meals) {
    items.push({
        type: 'meal',
        name: meal.name,
        start_time: meal.start_time,
        end_time: meal.end_time
    });
    }
    
    for (const sleep of currentDaySchedule.sleep) {
    items.push({
        type: 'sleep',
        name: 'Sleep',
        start_time: sleep.start_time,
        end_time: sleep.end_time
    });
    }
    console.log(items)
    
    items.sort((a, b) => {
        // Get the start time of each item as a Date object
        const startTimeA = convertTimeStringToDate(a.start_time);
        const startTimeB = convertTimeStringToDate(b.start_time);
        let diff = startTimeA - startTimeB;
        console.log(`a:${a.name}(${a.start_time}=>${startTimeA}), b: ${b.name}(${b.start_time}=>${startTimeB}), diff:${diff}, sign: ${Math.sign(diff)}`)
        // Compare the start times and return a negative value if a comes before b,
        // a positive value if a comes after b, or 0 if they are equal
        return  Math.sign(diff) ;
      });

    console.log(items)
    // Add free time
      for (let i = 0; i < items.length - 1; i++) {
        const currentEvent = items[i];
        const nextEvent = items[i + 1];
      
        // Calculate the duration of the gap between the events
        const gapDuration = calculateDuration(currentEvent.end_time, nextEvent.start_time);
      
        // If there is a gap, add a new event to fill it
        if (gapDuration > 0) {
          items.splice(i + 1, 0, {
            type: 'free time',
            name: 'Free time',
            start_time: currentEvent.end_time,
            end_time: nextEvent.start_time
          });
        }
      }
    return items
}

function renderTable(items) {
    const tableHTML = `<div class="schedule-table">${items.map(renderRow).join('')}</div>`;
    document.getElementById('content').innerHTML = `<h2>Today's Schedule</h2>${tableHTML}`;
}

function renderRow(item) {
  // Calculate the duration of the item in minutes
  const duration = calculateDuration(item.start_time, item.end_time);
  const currentTime = new Date();
  const startTime = convertTimeStringToDate(item.start_time);
  const endTime = convertTimeStringToDate(item.end_time);
  if (endTime - startTime < 0) {
    endTime.setDate(endTime.getDate() + 1);
  }
  let rowHTML = '';


  // Set the class of the row based on the type of the item
  if (currentTime >= startTime && currentTime <= endTime) {
    rowHTML += '<div class="hilighted-row">';
  } else if (item.type === 'activity') {
    rowHTML += '<div class="activity-row">';
  } else if (item.type === 'meal') {
    rowHTML += '<div class="meal-row">';
  } else if (item.type === 'free time') {
    rowHTML += '<div class="free-row">';
  } else if (item.type === 'sleep') {
    rowHTML += '<div class="sleep-row">';
  }



  
  // Set the height of the row based on the duration
  rowHTML += `<div class="name-cell" style="height: ${duration+150}px;">${item.name}</div>`;

  // Add the time cell
  rowHTML += `<div class="time-cell" style="height: ${duration+150}px;">
                <div class="time-row start-time">${item.start_time}</div>
                <div class="time-row duration">${duration} minutes</div>
                <div class="time-row end-time">${item.end_time}</div>
              </div>`;
  rowHTML += '</div>';
  return rowHTML;
}


function showToday_sSchedule() {
  const content = document.getElementById("content");
  console.log(ShapeTracker.schedule)
  // Display the user's schedule in the center panel
  // Get the current day of the week as a number (0 for Sunday, 1 for Monday, etc.)
  const today = new Date().getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[today];
  console.log(todayName);
  const currentDaySchedule = ShapeTracker.schedule.days.find(day => day.day === todayName);
  console.log(currentDaySchedule);

  // get items from the schedule
  items = prepare_items(currentDaySchedule)
  // Render the table        
  renderTable(items);

}

// Load the user's data and display it on the page
function loadData() {
  const schedule = ShapeTracker.schedule;
  const randomIndex = Math.floor(Math.random() * schedule.advice.length);
  
  const adviceDiv = document.getElementById("advise-div");
  const advicecontentDiv = document.getElementById("advise-content");
  
  const centerPanel = document.getElementById("center-panel");
  const closeButton = document.getElementById("close-button");
  if(adviceDiv){
    const randomAdvice = schedule.advice[randomIndex];
    advicecontentDiv.innerHTML = randomAdvice
    closeButton.addEventListener("click", () => {
        console.log("Removing advise")
        adviceDiv.remove();
      });  
  }
    

  const birthDate = ShapeTracker.birthdate;

  // Convert the birth date to a Date object
  const birthDateObject = new Date(birthDate);

  // Get the birth year
  const birthYear = birthDateObject.getFullYear();

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Calculate the age
  const age = currentYear - birthYear;

  // Display the user's name, age, and weight in the top banner
  const topBanner = document.getElementById("top-banner");
  topBanner.innerHTML = `<h1>Welcome, ${ShapeTracker.name}!</h1>
                      <p>Age: ${age}</p>
                      <p>Weight: ${ShapeTracker.weight}</p>`;

  showToday_sSchedule();
}

// Add a new weight entry to the user's data
function addWeight() {
  // Get the new weight and date from the form inputs
  const weight = document.getElementById("weight").value;
  const date = document.getElementById("date").value;

  // Update the ShapeTracker object in local storage with the new weight and date
  const ShapeTracker = JSON.parse(localStorage.getItem("ShapeTracker"));
  ShapeTracker.weights.push({ weight, date });
  localStorage.setItem("ShapeTracker", JSON.stringify(ShapeTracker));

  // Reload the data to update the displayed information
  loadData();
}

// Display the user's weight progress over time
function viewProgress() {
  // Load the ShapeTracker object from local storage
  const ShapeTracker = JSON.parse(localStorage.getItem("ShapeTracker"));

  // Display the weight progress chart in the center panel
  const centerPanel = document.getElementById("progress-page");
  centerPanel.innerHTML = `<h2>Weight Progress</h2>
                              <canvas id="chart"></canvas>`;

  // Create a new chart using the Chart.js library
  const ctx = document.getElementById("chart").getContext("2d");
  const chart = new Chart(ctx, {
      type: "line",
      data: {
      labels: ShapeTracker.weights.map(entry => entry.date),
      datasets: [
          {
          label: "Weight",
          data: ShapeTracker.weights.map(entry => entry.weight),
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1
          }
      ]
      },
      options: {
      scales: {
          yAxes: [
          {
              ticks: {
              beginAtZero: true
              }
          }
          ]
      }
      }
  });
}

// Export the user's data to a JSON file
function exportData() {
  // Load the ShapeTracker object from local storage
  const ShapeTracker = JSON.parse(localStorage.getItem("ShapeTracker"));

  // Convert the ShapeTracker object to a JSON string
  const data = JSON.stringify(ShapeTracker);

  // Create a new Blob object with the JSON data and the correct MIME type
  const blob = new Blob([data], { type: "application/json" });

  // Create a link element and set its href to the URL of the Blob object
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);

  // Set the file name for the downloaded file
  link.download = "ShapeTracker.json";

  // Append the link element to the body and click it to trigger the download
  document.body.appendChild(link);
  link.click();

  // Remove the link element from the body
  document.body.removeChild(link);
}

// Import data from a JSON file
function importData() {
  // Get the file input element and file object
  const fileInput = document.getElementById("file-input");
  const file = fileInput.files[0];

  // Create a FileReader to read the file as a text string
  const reader = new FileReader();
  reader.readAsText(file);

  // When the file has been read, update the ShapeTracker object with the imported data
  reader.onload = function() {
  const importedData = JSON.parse(reader.result);
  localStorage.setItem("ShapeTracker", JSON.stringify(importedData));
  loadData();
  };
}
/**

Compares two objects and returns true if they are equal, false otherwise.
@param {Object} obj1 - The first object to compare.
@param {Object} obj2 - The second object to compare.
@returns {boolean} - True if the objects are equal, false otherwise.
*/
function isEqual(a, b) {
  // Check if a and b are both objects
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    // Compare the keys of the objects
    if (Object.keys(a).length !== Object.keys(b).length) return false;

    // Recursively compare the values of the objects
    for (const key in a) {
      if (!isEqual(a[key], b[key])) return false;
    }

    return true;
  }

  // Compare the values of non-objects
  return a === b;
}

function populateWeights()
{
  const tableBody = document.querySelector('#weight-table tbody');
  tableBody.innerHTML = '';
  console.log(`upgrading the tables ${ShapeTracker.weights}`)
  for (const weight of ShapeTracker.weights) {
    // Create a new row for the weight value
    const row = document.createElement("tr");
  
    // Create a cell for the date
    const dateCell = document.createElement("td");
    dateCell.textContent = weight.date;
    row.appendChild(dateCell);
  
    // Create a cell for the weight
    const weightCell = document.createElement("td");
    weightCell.textContent = weight.weight;
    row.appendChild(weightCell);
  
    // Add the row to the table
    tableBody.appendChild(row);
  }

}
// Wait until the DOM is ready
document.addEventListener("DOMContentLoaded", function() {

    const planId = storedSchedule.plan_id;
    console.log(planId);
    const scheduleUrl = `schedules/schedule_${planId}.json`;
    fetch(scheduleUrl)
    .then(response => response.json())
    .then(latestSchedule => {
      // Compare the stored schedule with the latest schedule here
      console.log(`Plan id is :${planId}`);
      if (!isEqual(storedSchedule, latestSchedule)) {
        // Update the stored schedule
        ShapeTracker.schedule = latestSchedule;
        console.log(`schedule has changed`);
        localStorage.setItem("ShapeTracker", JSON.stringify(ShapeTracker));
      }
    });

    // Add event listeners to the menu options
    todayLink.addEventListener("click", function(e) {
        e.preventDefault();
        // Hide all pages
        document.getElementById("progress-page").style.display = "none";
        document.getElementById("add-page").style.display = "none";

        // Show the schedule page
        document.getElementById("schedule-page").style.display = "block";

        loadData();
    });
    addLink.addEventListener("click", function(e) {
        e.preventDefault();
        
        // Hide all pages except the right one
        document.getElementById("schedule-page").style.display = "none";
        document.getElementById("progress-page").style.display = "none";
        document.getElementById("add-page").style.display = "block";

        populateWeights();
    });
    progressLink.addEventListener("click", function(e) {
        e.preventDefault();
        // Hide all pages except the right one
        document.getElementById("schedule-page").style.display = "none";
        document.getElementById("progress-page").style.display = "block";
        document.getElementById("add-page").style.display = "none";
        viewProgress();
    });
    exportLink.addEventListener("click", function(e) {
        e.preventDefault();
        exportData();
    });
    importLink.addEventListener("click", function(e) {
        e.preventDefault();
        importData();
    });

    // Load the data on page load
    loadData();
});