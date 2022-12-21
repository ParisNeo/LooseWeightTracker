const form = document.getElementById("form");

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