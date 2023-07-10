function handleAvatar(event) {
  event.preventDefault();
  const inputText = document.getElementById("avatarInput").value;
  const type = document.getElementById("typeInput").value;
  const resultDiv = document.getElementById("avatarResult");
  const countDiv = document.getElementById("count");
  let image;

  console.log(inputText);
  // Clear the input field
  document.getElementById("avatarInput").value = "";
  document.getElementById("avatarDiv").style.display = "none";

  // Loading Screen
  document.getElementById("loading-screen").style.display = "flex";

  const avatarCloseButton = document.querySelector(".home-button2");
  const avatarDiv = document.querySelector("#avatarDiv");

  avatarCloseButton.addEventListener("click", () => {
    avatarDiv.style.display = "none";
  });

  const downloadButton = document.getElementById("downloadAvatar");
  downloadButton.addEventListener("click", () => {
    const imageUrl = image; // Replace with the actual image URL

    // Open the image in a new tab for download
    window.open(imageUrl, "_blank");
  });

  // Check if user has remaining avatar generations
  if (parseInt(countDiv.innerText) > 0) {
    // Send a POST request to /avatar endpoint
    fetch("/avatar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputText, type }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Check for errors in the response data
        if (data.error) {
          throw new Error(data.error);
        }

        // Display the avatar
        console.log(data.avatar);
        image = data.avatar;
        resultDiv.src = image;
        document.getElementById("avatarDiv").style.display = "flex";
        countDiv.innerText = data.avatarGenerations;
      })
      .catch((error) => {
        alert("An error occurred while generating the avatar");
      })
      .finally(() => {
        document.getElementById("loading-screen").style.display = "none";
      });
  } else {
    alert("No more avatar generations available.");
    document.getElementById("loading-screen").style.display = "none";
  }
}
