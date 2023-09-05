Piscataqua Watershed Data Explorer
----------------------------------

*Prepared for*: [Piscataqua Region Estuaries Partnership (PREP)](https://prepestuaries.org/)

*By*: Jeffrey D Walker, PhD ([Walker Environmental Research LLC](https://walkerenvres.com)) in collaboration with Laura Diemer, Luke Frankel ([FB Environmental](https://www.fbenvironmental.com/))

Links:
- **Live Website**: http://data.prepestuaries.org/data-explorer/  
- **Development Website**: http://walkerenvres-prep.s3-website-us-east-1.amazonaws.com/

## Overview

This repo contains the source code for the Piscataqua Watershed Data Explorer. The PWDE is a client-side web application developed using Vue.js, Vuetify, and Vite. Data are loaded from a PostgREST API to the PREP Database. The primary goals of this application are to provide a user-friendly interface for exploring and downloading water quality data throughout the PREP region.

## Project Setup

### Install Dependencies

After cloning this repo, install the dependencies:

```sh
npm install
```

### Configuration

The application is configured using environment variables defined using `.env` files for each environment (e.g., `.env.development` for the development environment). The following environment variables are required:

```
VITE_API_URL="URL to the database API"
BASE_URL="Base URL for the application"
```

## Development Server

Run the `dev` command to start up a development server using Vite, which supports hot module reloading:

```sh
npm run dev
```

Then navigate to the URL provided by Vite in your browser.

## Production Build

To build the application for production, run the `build` command:

```sh
npm run build
```

## Deployment

After building the application, copy the contents of the `dist/` directory to the production web server.

```sh
# using rsync
rsync -avz dist/ user@server:/path/to/destination
# using scp
scp -r dist/ user@server:/path/to/destination
# using aws
aws s3 sync dist/ s3://bucket/path/to/destination
```
## License

This application is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
