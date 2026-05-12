# Amitabha Roy Real Estate Lead Generation Website

This repository contains a modern, high-converting real estate lead generation website tailored for Amitabha Roy in Halifax, Nova Scotia. 

The website is built with a focus on performance and premium aesthetics, utilizing Vanilla HTML5, CSS3, and JavaScript on the frontend. It features an interactive property map (via Leaflet.js), dynamic scroll animations, and client testimonials. The backend is powered by a lightweight Node.js/Express server that securely captures and stores user inquiries directly into a local SQLite database.

## Dependencies

To run this project locally, you will need Node.js, npm, and SQLite installed on your system. 

If you are using **Fedora Linux**, you can install all the required dependencies using `dnf`:

```bash
sudo dnf install nodejs npm sqlite
```

## Setup

Once your dependencies are installed, navigate to the project directory and install the required Node modules:

```bash
npm install
```

## Running the Web Server & Database

The SQLite database is completely self-contained and automatically initializes itself the first time the server runs.

**To bring up the server:**

```bash
node server.js
```
*The website will now be accessible at `http://localhost:3000`.*

**To tear down the server and database:**

1. **Stop the server:** Press `Ctrl + C` in the terminal where the server is running.
2. **Reset the database (Optional):** If you want to completely wipe all captured leads and reset the database, simply delete the `leads.db` file:
   ```bash
   rm leads.db
   ```
