(() => {
  "use strict";
  const form = document.getElementById("review-form");
  if (!form) return;
  const list = document.getElementById("review-list");
  const empty = document.getElementById("review-empty");
  const error = document.getElementById("review-error");
  const message = document.getElementById("review-text");
  const success = document.getElementById("review-success");
  const ratings = [];

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";
    success.textContent = "";
    const rating = form.querySelector('input[name="rating"]:checked');
    if (!rating) {
      error.textContent = "Choose a rating from 1 to 5 stars.";
      form.querySelector('input[name="rating"]').focus();
      return;
    }
    if (message.value.trim().length < 10) {
      error.textContent =
        "Please write at least 10 characters about your experience.";
      message.setAttribute("aria-invalid", "true");
      message.focus();
      return;
    }
    message.removeAttribute("aria-invalid");
    const card = document.createElement("article");
    card.className = "submitted-review";
    const stars = document.createElement("p");
    stars.className = "review-stars";
    stars.setAttribute("aria-label", `${rating.value} out of 5 stars`);
    stars.textContent =
      "★".repeat(Number(rating.value)) + "☆".repeat(5 - Number(rating.value));
    const text = document.createElement("p");
    text.className = "review-body";
    text.textContent = message.value.trim();
    const byline = document.createElement("p");
    byline.className = "review-byline";
    byline.textContent =
      document.getElementById("review-name").value.trim() ||
      "Anonymous visitor";
    const note = document.createElement("span");
    note.className = "review-demo-badge";
    note.textContent = "Local demo review";
    card.append(stars, text, byline, note);
    empty.hidden = true;
    list.prepend(card);
    ratings.push(Number(rating.value));
    const average = (
      ratings.reduce((a, b) => a + b, 0) / ratings.length
    ).toFixed(1);
    document.getElementById("review-count").textContent =
      `${average} / 5 from ${ratings.length} local demo ${ratings.length === 1 ? "review" : "reviews"}`;
    form.reset();
    success.textContent =
      "Your demo review is visible in this tab. It has not been published or sent.";
  });
  message.addEventListener("input", () => {
    if (message.value.trim().length >= 10) {
      message.removeAttribute("aria-invalid");
      error.textContent = "";
    }
  });
  form.querySelector('[type="submit"]').disabled = false;
})();
