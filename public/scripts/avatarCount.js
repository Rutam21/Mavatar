const countDiv = document.getElementById("count");

document.addEventListener("DOMContentLoaded", () => {
  // Fetch the initial count value from the server
  fetch("/avatarCount")
    .then((response) => response.json())
    .then((data) => {
      countDiv.innerText = data.avatarGenerations;
    })
    .catch((error) => {
      console.error("Error fetching avatar count:", error);
    });
});
