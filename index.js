// Load the ShapeTracker object from local storage
const ShapeTracker = JSON.parse(localStorage.getItem("ShapeTracker"));


function loadJSON(file) {
    // Running on a server, use the fetch function
    return fetch(file)
      .then(response => response.json())
      .catch(error => {
        throw error;
      });
}

if (ShapeTracker) {
  // ShapeTracker object is found, redirect to index page
  window.location.href = "main.html";
} else {
  const form = document.getElementById("form");
  const planSelect = document.getElementById("plan");
  const planInfoDiv = document.getElementById("plan-info");
  // Load the plans from the plans.json file and add them to the select element
  loadJSON('plans.json')
  .then(plans => {
    // Use the data here
    console.log(plans);
    plans.forEach(plan => {
      const option = document.createElement("option");
      option.value = plan.plan_name;
      option.text = plan.plan_name;
      planSelect.add(option);
    });
})
  .catch(error => {
    // Handle the error here
    console.error(error);
  });


  
  
  // Start tracking function
  function startTracking() {
    // Get the form values
    const name = document.getElementById("name").value;
    const birthdate = document.getElementById("birthdate").value;
    const weight = document.getElementById("weight").value;
    var plan_id = 0;
    
    fetch("plans.json")
    .then(response => response.json())
    .then(plans => {
      const selectedPlan = plans.find(plan => plan.plan_name === planSelect.value);

      fetch(`./schedules/schedule_${selectedPlan.plan_id}.json`)
      .then(response => response.json())
      .then(schedule => {
     
      // Create the ShapeTracker object
      const ShapeTracker = {
        name: name,
        birthdate: birthdate,
        weight: weight,
        plan: plan,
        weights: [],
        schedule:schedule
      };
    
      // Save the ShapeTracker object to local storage
      localStorage.setItem("ShapeTracker", JSON.stringify(ShapeTracker));
      
      // Redirect to the main page
      window.location.href = "main.html";

      }).catch(reason=>{
        alert("Something went wrong. Couldn't find the schedule for the plan you specified")
        return
      });
      
    }).catch(reason => {
      alert("Something went wrong. Couldn't find the plan you specified")
      return
    });


  

  }
 
  
  form.addEventListener("submit", e => {
    const weight = document.getElementById("weight").value;
    const birthdate = document.getElementById("birthdate").value;
    e.preventDefault();
    if (weight <= 0 || weight === "") {
      alert("Please enter a valid weight value");
    }
    else if (birthdate===""){
      alert("Please enter a valid birthdate value");
    }
    else{
      startTracking();
    }
  });
  
  
  // Update the plan info div when the plan select element changes
  planSelect.addEventListener("change", e => {
    loadJSON('plans.json')
    .then(plans => {
      // Use the data here
      const selectedPlan = plans.find(plan => plan.plan_name === e.target.value);
      planInfoDiv.innerHTML = selectedPlan.plan_description;
    });
  });
  // If the ShapeTracker object already exists in local storage, redirect to the main page on page load
  window.addEventListener("load", () => {
    loadJSON('plans.json')
    .then(plans => {
      // Use the data here
      const selectedPlan = plans.find(plan => plan.plan_name === planSelect.value);
      planInfoDiv.innerHTML = selectedPlan.plan_description;
    });

  });

  // Import data from a JSON file
  function importData() {
    // Get the file input element and file object
    const fileInput = document.getElementById("file-input");
    fileInput.click();
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
}




