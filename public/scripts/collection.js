const viewMoreButton = document.querySelector(".home-view1");
const hiddenCards = Array.from(
  document.querySelectorAll(
    ".home-card05, .home-card06, .home-card07, .home-card08, .home-card09, .home-card10, .home-card11, .home-card12, .home-card13, .home-card14, .home-card15, .home-card16"
  )
);

let isExpanded = false;

viewMoreButton.addEventListener("click", () => {
  hiddenCards.forEach((card) => {
    card.classList.toggle("hidden"); // Toggle the visibility of additional cards
  });

  isExpanded = !isExpanded; // Toggle the expanded state

  // Update button text based on expanded state
  const viewMoreText = document.querySelector(".home-text07");
  const viewMoreIcon = document.querySelector(".home-icon14");
  const viewLessText = document.querySelector(".home-text08");
  const viewLessIcon = document.querySelector(".home-icon16");
  if (isExpanded) {
    viewMoreText.style.display = "none";
    viewMoreIcon.style.display = "none";
    viewLessText.style.display = "block";
    viewLessIcon.style.display = "block";
  } else {
    viewMoreText.style.display = "block";
    viewMoreIcon.style.display = "block";
    viewLessText.style.display = "none";
    viewLessIcon.style.display = "none";
  }
});
