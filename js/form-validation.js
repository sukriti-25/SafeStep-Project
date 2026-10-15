(() => {
  "use strict";
  const form = document.getElementById("demo-form");
  if (!form) return;
  const fields = [...form.querySelectorAll("[required]")];
  const summary = document.getElementById("form-summary");
  const success = document.getElementById("form-success");
  let submitted = false;
  const submitButton = form.querySelector('[type="submit"]');
  const messages = {
    "full-name": "Enter your full name.",
    organisation: "Enter your organisation name.",
    email: "Enter your work email address.",
    message: "Tell us a little about your training needs.",
    consent:
      "Please read the privacy notice and check the consent box to continue.",
  };
  function validate(field) {
    let message = "";
    if (field.type === "checkbox" ? !field.checked : !field.value.trim()) {
      message = messages[field.id];
    } else if (
      field.type === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())
    ) {
      message = "Enter a valid email address, such as alex@organisation.com.";
    } else if (field.validity.tooLong) {
      message = `Please use no more than ${field.maxLength} characters.`;
    }
    field.setAttribute("aria-invalid", String(Boolean(message)));
    document.getElementById(`${field.id}-error`).textContent = message;
    return !message;
  }
  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      if (field.type !== "checkbox") validate(field);
    });
    field.addEventListener(
      field.type === "checkbox" ? "change" : "input",
      () => {
        if (submitted || field.getAttribute("aria-invalid") === "true")
          validate(field);
        if (submitted) {
          const remaining = fields.filter(
            (item) => item.getAttribute("aria-invalid") === "true",
          ).length;
          summary.hidden = !remaining;
          summary.textContent = remaining
            ? `Please check ${remaining} ${remaining === 1 ? "field" : "fields"} below.`
            : "";
        }
      },
    );
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitted = true;
    const invalid = fields.filter((field) => !validate(field));
    summary.hidden = invalid.length === 0;
    if (invalid.length) {
      summary.textContent = `Please check ${invalid.length} ${invalid.length === 1 ? "field" : "fields"} below.`;
      invalid[0].focus();
      return;
    }
    if (location.protocol === "file:") {
      summary.hidden = false;
      summary.textContent =
        "To send your request, open this website through its web address or email ishanbhan61@gmail.com directly. Local file previews cannot send requests.";
      summary.focus();
      return;
    }
    if (form.elements.namedItem("_honey")?.value) return;

    submitButton.disabled = true;
    submitButton.textContent = "Sending your request…";
    form.setAttribute("aria-busy", "true");

    HTMLFormElement.prototype.submit.call(form);
    form.removeAttribute("aria-busy");
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });
  document.getElementById("reset-form").addEventListener("click", () => {
    submitted = false;
    success.hidden = true;
    form.hidden = false;
    form.reset();
    submitButton.disabled = false;
    summary.hidden = true;
    summary.textContent = "";
    fields.forEach((field) => {
      field.removeAttribute("aria-invalid");
      document.getElementById(`${field.id}-error`).textContent = "";
    });
    fields[0].focus();
  });
  // Enable only after validation and delivery handlers are ready.
  submitButton.disabled = false;
})();
