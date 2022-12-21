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

form.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const weight = document.getElementById("weight").value;
  const plan = document.getElementById("plan").value;

  // Store the user's information in local storage
  localStorage.setItem("name", name);
  localStorage.setItem("age", age);
  localStorage.setItem("weight", weight);
  localStorage.setItem("plan", plan);

  // Redirect to the main page
  window.location.href = "main.html";
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