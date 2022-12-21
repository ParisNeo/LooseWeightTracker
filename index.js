// Load the ShapeTracker object from local storage
const ShapeTracker = JSON.parse(localStorage.getItem("ShapeTracker"));

if (ShapeTracker) {
  // ShapeTracker object is found, redirect to index page
  window.location.href = "main.html";
} else {
  const form = document.getElementById("form");
  const planSelect = document.getElementById("plan");
  const planInfoDiv = document.getElementById("plan-info");
  
  // Load the plans from the plans.json file and add them to the select element
  fetch("plans.json")
    .then(response => response.json())
    .then(plans => {
      plans.forEach(plan => {
        const option = document.createElement("option");
        option.value = plan.plan_name;
        option.text = plan.plan_name;
        planSelect.add(option);
      });
    });
  
  
  // Start tracking function
  function startTracking() {
    // Get the form values
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const weight = document.getElementById("weight").value;
    const plan = document.getElementById("plan").value;
    var plan_id = 0;
    var schedule = {};
    
    fetch("plans.json")
      .then(response => response.json())
      .then(plans => {
        const selectedPlan = plans.find(plan => plan.plan_name === e.target.value);
        plan_id = selectedPlan.plan_id;
      })

    console.log(`Found plan_id ${plan_id}`)
    fetch(`schedules/schedule_${plan_id}.json`)
    .then(response => response.json())
    .then(fnd_schedule => {
      schedule = fnd_schedule
    })
    console.log("Found schedule ${schedule}")

  
    // Create the ShapeTracker object
    const ShapeTracker = {
      name: name,
      age: age,
      weight: weight,
      plan: plan,
      weights: [],
      schedule:schedule

    };
  
    // Save the ShapeTracker object to local storage
    localStorage.setItem("ShapeTracker", JSON.stringify(ShapeTracker));
  
    // Redirect to the main page
    //window.location.href = "main.html";
  }
  
  form.addEventListener("submit", e => {
    e.preventDefault();
    startTracking();
  });
  
  
  // Update the plan info div when the plan select element changes
  planSelect.addEventListener("change", e => {
    fetch("plans.json")
      .then(response => response.json())
      .then(plans => {
        const selectedPlan = plans.find(plan => plan.plan_name === e.target.value);
        planInfoDiv.innerHTML = selectedPlan.plan_description;
      })
  });
  // If the ShapeTracker object already exists in local storage, redirect to the main page on page load
  window.addEventListener("load", () => {
      fetch("plans.json")
      .then(response => response.json())
      .then(plans => {
        const selectedPlan = plans.find(plan => plan.plan_name === planSelect.value);
        planInfoDiv.innerHTML = selectedPlan.plan_description;
      })
    });

}

