# Himalayan Adhesives – Daily Field Report

A mobile-friendly dashboard where field staff fill the Daily Field Report and export it as a PDF with the company logo.
No server, no build step, no sign-in. It is plain HTML, CSS and JavaScript.

## Features
- Dashboard with live totals: visits, productive calls, secondary and primary sales, collection
- Dealer visits table: add or remove rows, discussion dropdown, "Productive" tick box
- Profile: name, designation, territory and manager are saved once and pre-fill every report
- Dealer address book: type a name and the address and phone fill in from earlier reports
- History: every saved report can be opened, exported again or deleted
- Validation: blocks save and export when required details are missing or a phone number looks wrong
- PDF export (A4, logo, totals, signature lines), plus a Print / Save as PDF backup
- Backup and restore of all data as a JSON file
- Works offline and can be installed on a phone ("Add to Home screen")

## Where is data stored?
In the browser's `localStorage` on the device that was used. Nothing is sent anywhere.
Use **Profile → Download backup** regularly, because clearing browser data or switching phones removes it.

## Run locally
Open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000      # then open http://localhost:8000

## Publish on GitHub Pages
1. Create a new repository on GitHub (for example `field-report`).
2. In this folder run:

       git init
       git add .
       git commit -m "Daily Field Report dashboard"
       git branch -M main
       git remote add origin https://github.com/<your-username>/field-report.git
       git push -u origin main

3. On GitHub open **Settings → Pages** and set **Source** to **GitHub Actions**.
4. Open the **Actions** tab. When "Deploy to GitHub Pages" turns green, the site is live at
   `https://<your-username>.github.io/field-report/`.

Every later `git push` to `main` redeploys automatically. It also works on Netlify, Vercel or any static host.

## Project structure
    index.html            page layout
    css/style.css         styles (light, dark and print)
    js/app.js             app logic, PDF builder, storage, backup
    js/logo.js            logo as base64 (used inside the PDF)
    vendor/               jsPDF 2.5.1 and jsPDF-AutoTable 3.8.2 (bundled, no internet needed)
    assets/               logo and app icons
    manifest.json, sw.js  installable app and offline cache
    .github/workflows/    GitHub Pages deployment

## Changing things
- **Discussion options:** edit the `DISC` list near the top of `js/app.js`.
- **Logo:** replace `assets/logo.png` and regenerate `js/logo.js` from the same image (base64).
- **After any change:** bump `CACHE` in `sw.js` (for example `hfr-v2`) so installed phones update.

## Known limits
- The downloaded PDF supports English text. If a field contains Hindi or other non-Latin text, the app switches to the Print / Save as PDF layout, which supports all languages.
- Data lives per browser and per device, so the same login on two phones will not share reports. Use backup and restore to move data.
