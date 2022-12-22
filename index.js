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
    const birthdate = document.getElementById("birthdate").value;
    const weight = document.getElementById("weight").value;
    var plan_id = 0;
    var schedule = {};
    
    fetch("plans.json")
    .then(response => response.json())
    .then(plans => {
      console.log("seeking plans")
      const selectedPlan = plans.find(plan => plan.plan_name === planSelect.value);
      console.log(`Found plan ${selectedPlan}`)
      plan_id = selectedPlan.plan_id;
    })

    console.log(`Found plan -> ${planSelect.value}`)

    console.log(`Found plan_id ${plan_id}`)
    fetch(`schedules/schedule_${plan_id}.json`)
    .then(response => response.json())
    .then(fnd_schedule => {
      schedule = fnd_schedule
    }).catch(reason=>{
      console.log(reason);
    })
    console.log(`Found schedule ${schedule}`)

  
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
    //window.location.href = "main.html";
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
    fetch("plans.json")
      .then(response => response.json())
      .then(plans => {
        const selectedPlan = plans.find(plan => plan.plan_name === e.target.value);
        planInfoDiv.innerHTML = selectedPlan.plan_description;
      }).catch(reason=>{
        console.log(reason);
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

