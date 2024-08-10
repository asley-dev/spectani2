// Declare the variable and assign a value
var myVariable = "Hello, world!";

// Retrieve the HTML element by its ID
var displayElement = document.getElementById('display');

// Set the content of the HTML element to the variable value
displayElement.innerText = myVariable;

// Alternatively, you can use innerHTML if you want to include HTML tags in the value
// displayElement.innerHTML = "<strong>" + myVariable + "</strong>";
