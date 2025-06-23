# P2P Tools Web Application

This repository contains the web application for P2P Tools, offering a margin calculator, P2Pedia guide, contact/FAQ section, and a new Privacy Policy.

## Recent Modifications Overview

This update introduces a dedicated "Privacy Policy" tab to the navigation, ensuring transparency regarding data handling. Several other enhancements have been made to improve user experience and clarity across the application.

### Key Features & Enhancements:

* **New "Privacy Policy" Tab:** A new section has been added to the main navigation, providing detailed information about how P2P Tools handles user data, emphasizing its privacy-centric approach (no personal data collection).
* **Consistent Fade-in Effects:** All dynamically loaded content sections (Calculators, P2Pedia, Contact/FAQ, and Privacy Policy) now consistently utilize a `fade-in` animation for a smoother user experience.
* **Improved Number Formatting (Input Fields):** Input fields in the calculators now automatically format numbers with thousands separators (e.g., `1000000` becomes `1.000.000`) as the user types and upon losing focus. This enhances readability while ensuring underlying calculations use the correct numerical values.
* **Enhanced Card Hover Effects:** Calculator cards now feature a subtle "floating window" effect on hover, with a slight lift and an increased box-shadow, adding a modern and interactive touch.
* **Refined Calculator Output Messages:** The feedback messages for the Margin Calculator have been improved to provide clearer suggestions, especially when the calculated profit margin is low.
* **Updated Contact & FAQ Section:** Your contact details (email, Telegram, Binance ID) and a subtle donation request have been integrated into this section for user convenience and project support.

## File Changes Summary

Here's a breakdown of the modifications made to the core files:

### `index.html`

* **Added Navigation Tab:** A new `<button class="nav-tab" data-tab="privacy-policy">Política de Privacidad</button>` has been added to the `<nav class="nav-tabs">` element.

### `script.js`

* **`privacyPolicyContentHTML` Constant:** A new JavaScript constant `privacyPolicyContentHTML` has been introduced. This multi-line string contains the full HTML content for the "Política de Privacidad" page, including headings, paragraphs, and list items detailing the privacy practices.
* **`loadContent` Function Update:** The `loadContent` function now includes an `else if (tabName === 'privacy-policy')` condition to dynamically load the new `privacyPolicyContentHTML` into the `app-content` div when the "Política de Privacidad" tab is clicked.
* **Minor Adjustments:** No other significant functional changes were made, as the existing `fade-in` logic in `loadContent` naturally supports the new tab.

### `style.css`

* **New Section Styling:** Basic styling for `.privacy-policy-section`, `.privacy-policy-section .card-body`, `h3` within this section, and `ul`/`li` elements has been added to maintain visual consistency with the rest of the application's dark theme and card-based layout.
* **Responsive Adjustments:** Media queries for larger screens have been updated to include specific padding and font-size adjustments for the `.privacy-policy-section`, ensuring optimal display across various devices.

## How to Deploy/Update

1.  **Replace Files:** Replace your existing `index.html`, `script.js`, and `style.css` files with the updated versions provided.
2.  **Clear Cache:** Advise users to clear their browser cache (Ctrl+F5 or Cmd+Shift+R) to ensure they load the latest versions of the files.

## Future Enhancements

* **Persistent Ngrok URL:** Consider obtaining a stable domain or a paid ngrok plan if you intend for the web application to be publicly accessible long-term, as the current ngrok free URL changes.
* **Advanced State Management:** For highly complex calculator interactions, exploring more advanced JavaScript state management patterns might be beneficial.

---

This README should effectively communicate the changes to anyone reviewing your project.
