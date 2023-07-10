function checkFormInputs(form) {
  const inputs = form.querySelectorAll("input");
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value.trim() === "") {
      alert("Please fill in the avatar description.");
      return false; // Prevent form submission
    }
  }
  return true;
}
