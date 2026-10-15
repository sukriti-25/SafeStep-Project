# SafeStep

A responsive promotional website for a student workplace health-and-safety training project. It introduces the company, platform concept, and proposed services and offers a demonstration request form. It is not a production training system.

## Pages

- `index.html` — promotional homepage with a scenic hero, photographic module feature, detailed project-role profiles, a working demo review form, benefits, capabilities, process, sectors, and demo calls to action.
- `about.html` — mission, vision, values, team roles, and feedback process.
- `services.html` — learning modules, Manual Handling, dashboards, and the complete supplied SafeStep 360 training prototype embedded in the platform page.
- `contact.html` — accessible, validated prototype demo form.
- `privacy.html` — accurate explanation of the prototype's information handling.
- `login.html` — working learner and administrator sign-in for the local prototype.
- `dashboard.html` — learner progress, both required activities, percentage marks, recent activity, and certificate status.
- `certificate.html` — gated completion certificate unlocked after both required activities are passed.
- `profile.html` and `help.html` — editable learner details and training support guidance.
- `admin.html` — administrator overview with learner results, completion status, certificate eligibility, and progress reset.

## Run locally

Open `index.html` in any modern browser. No installation, build step, internet connection, or server is required. All styles, scripts, and visuals are local and use relative paths.

Optionally run `python -m http.server 8000` from this folder and open `http://localhost:8000`.

## Technologies and files

Semantic HTML5, CSS Grid and Flexbox, and dependency-free JavaScript. Shared styles live in `css/styles.css`, with the scenic SafeStep design in `css/refinement.css`; navigation, keyboard-operable preview tabs, and sample hazard interactions in `js/main.js`; form validation in `js/form-validation.js`.

`assets/logo.svg`, `assets/favicon.svg`, and `assets/images/warehouse.svg` are original SVG artwork created for this project. The site uses local system fonts. No stock images, third-party fonts, or external libraries are required. The latest user direction establishes the SafeStep name and a forest-green, rhododendron-red, and white palette inspired by the supplied prototype. The generated Himalayan image is used in the main hero and as a softer background on inner pages. Its provenance and generation prompt are recorded in `assets/images/IMAGE-NOTES.md`.

## Demo form: email delivery

Demo requests are sent to **ishanbhan61@gmail.com** through FormSubmit’s HTTPS form endpoint. No Supabase project is connected: the signed-in CLI listed four inactive projects, and no project was selected. This implements the requested direct-email alternative without exposing an API secret in the browser.

The form retains field-level validation and a honeypot. It posts to a hidden delivery frame so visitors remain on the contact page and see “Congratulations, your form has been submitted” after a valid submission. The request includes all optional fields, consent, a subject, and a table email template. The visitor’s `email` field supports Reply-To. No autoresponse or CC recipients are configured.

**Owner activation is required.** The first submission triggers a FormSubmit activation email to the recipient. Open that email and activate the form, checking Spam if needed. A new website URL may require activation again. Do not regard delivery as operational until an end-to-end test arrives in the recipient’s inbox.

Serve this site over HTTP/HTTPS to send the form. Opening `index.html` directly still previews the website, but direct `file://` form submission is blocked with a helpful message. Use `python -m http.server 8000` for local testing. The page also offers a direct email link. Without JavaScript, that email link remains available.

Provider documentation: [FormSubmit setup](https://formsubmit.co/) and [delivery/activation help](https://formsubmit.co/help). FormSubmit states that it retains submissions for 30 days; the privacy page explains real form delivery separately from local-only reviews.

## Interactive scenario scope

The platform page includes working My learning, Scenario practice, and My progress tabs. Its former custom hazard board has been superseded by the complete prototype supplied in `demo prototype safestep.zip`. The integrated build lives in `assets/training/safestep-360/` and contains full Warehouse Hazard Training and Working at Height journeys: module briefs, four clickable hazards, immediate corrective feedback, a 120-second timer, hints, viewpoint controls, three-question assessments, scoring, results, repeat actions, and module selection. Fire Safety appears as a disabled coming-soon module, matching the supplied build. The supplied Laliguras PNG and prototype README are preserved beside the training page.

Raw module scores are converted to percentages: the maximum 70 points displays as 100%. Passed results are stored against the signed-in learner. The certificate remains locked until both Warehouse Hazard Training and Working at Height are complete, then shows the learner's name, average percentage, completion date, and a print/save-PDF action.

## Prototype portal accounts

The sign-in and dashboards are browser-based demonstrations. They use local storage so the full learner and administrator flows work on a static site; they are not production authentication.

- Learner: `learner@safestep.demo` / `SafeStep123!`
- Administrator: `admin@safestep.demo` / `AdminSafe123!`

The learner can complete both activities, review percentage results, edit profile details, read FAQs, and unlock the certificate. The administrator can review each learner's module marks, programme average, completion status, and reset progress.

## Accessibility and responsive design

Includes a skip link, one h1 per page, semantic landmarks, labelled fields, field-level errors, visible keyboard focus, keyboard-operable tabs, Escape-to-close mobile navigation, descriptive image alternatives, sufficient text contrast, and reduced-motion support. Layouts adapt to mobile, tablet, and desktop. Mobile form inputs use 16px text. No autoplay or background animation is used.

## Deployment

Upload the folder to any static host. For GitHub Pages, publish the repository root from the selected branch. For Netlify, deploy the folder with no build command. Keep the relative file structure intact. The FormSubmit destination must be activated for the deployed site; check delivery after publishing.

## Review checklist

- Follow header, footer, and in-page links on all five pages.
- Resize to mobile, tablet, and desktop; check the mobile menu, text wrapping, and horizontal overflow.
- Try an empty form, whitespace values, malformed email, unchecked consent, and a valid sample submission; confirm reset works.
- Use Tab, Shift+Tab, arrow keys, Home/End, Enter/Space, and Escape to exercise controls.
- Check all local images load and the browser console contains no application errors.

The prototype makes no customer, certification, performance, or safety-outcome claims. Training content is illustrative and should be reviewed with appropriate subject-matter experts before use in a real workplace.

## Verification performed

- All five pages and 11 unique linked local resources loaded successfully; internal fragment targets resolved.
- All five pages were checked at widths of 320, 390, 768, 1024, and 1440 pixels with no horizontal overflow or missing images.
- Field validation, hidden-frame delivery, the confirmation state, and all local page routes were checked against the running site.
- Preview tab arrow/Home/End controls, both complete four-hazard training journeys, module switching, hints, scoring, assessments, results, mobile menu, Escape focus restoration, and visible keyboard focus were verified.
- Learner and administrator sign-in, role-based page routing, persistent module progress, percentage conversion, certificate gating, certificate printing, profile editing, help accordions, administrator reporting, and progress reset were verified.
- JavaScript syntax checks passed. No application console errors or warnings were found on the checked pages.
- Desktop and mobile screenshots were reviewed, including the full About and Contact pages. The home page was also opened directly using a local `file://` URL.

## Supplied SafeStep logo

The header, footer, and browser tab icon use the user-provided safety-worker artwork, copied byte-for-byte to `assets/images/safestep-logo.png`. CSS preserves its native square aspect ratio with `object-fit: contain`; the PNG itself is not edited or recreated in code. SafeStep remains the platform name.

## Team details and reviews

The homepage and About page include six named team profiles based on the user-supplied Team Roles and Responsibilities table: Sukriti Rimal, Aayush Neupane, Arbin Giri, Sijan Kafle, Ishan Bhandari, and Sakshyam Pokhrel. Their allocated roles and planning responsibilities are reproduced from that source. Initials are used because member photographs were not supplied. No customer testimonials have been invented.

`js/reviews.js` runs the homepage demo review form. Visitors choose 1–5 stars and write at least 10 characters, with an optional name. A submitted review and aggregate rating appear in the current tab only; entries are not stored or transmitted and clear on reload. User text is rendered with `textContent`. The privacy page documents this behaviour.
