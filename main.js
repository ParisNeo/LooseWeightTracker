function deleteAllData() {
    if (confirm("Are you sure you want to delete all data? This action cannot be undone.")) {
      localStorage.clear();
      window.location.href = "index.html";
    }
  }
// Wait until the DOM is ready
document.addEventListener("DOMContentLoaded", function() {
    // Get the instances of each element
    const todayLink = document.getElementById("today");
    const addLink = document.getElementById("add");
    const progressLink = document.getElementById("progress");
    const exportLink = document.getElementById("export");
    const importLink = document.getElementById("import");



    // Load the user's data and display it on the page
    function loadData() {
        // Load the ShapeTracker object from local storage
        const ShapeTracker = JSON.parse(localStorage.getItem("ShapeTracker"));
        const schedule = ShapeTracker.schedule;
        const randomIndex = Math.floor(Math.random() * schedule.advice.length);
        const randomAdvice = schedule.advice[randomIndex];
        console.log(randomAdvice)
    
        /*
        const centerPanel = document.getElementById("center-panel");
        const adviceDiv = document.getElementById("advise-div");
        const advicecontentDiv = document.getElementById("advise-content");
        
        const closeButton = document.getElementById("close-button");
        advicecontentDiv.innerHTML = randomAdvice
        closeButton.addEventListener("click", () => {
            adviceDiv.style.visibility=false;
          });
          */

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
    
        // Display the user's schedule in the center panel
        centerPanel.innerHTML = `<h2>Today's Schedule</h2>
                                <p>${ShapeTracker.schedule}</p>`;
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
        const centerPanel = document.getElementById("center-panel");
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
    
    // Add event listeners to the menu options

    // Add event listeners to the menu options
    todayLink.addEventListener("click", function(e) {
        e.preventDefault();
        loadData();
    });
    addLink.addEventListener("click", function(e) {
        e.preventDefault();
        addWeight();
    });
    progressLink.addEventListener("click", function(e) {
        e.preventDefault();
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