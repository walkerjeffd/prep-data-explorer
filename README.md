Piscataqua Watershed Data Explorer
----------------------------------

*Prepared for*: [Piscataqua Region Estuaries Partnership (PREP)](https://prepestuaries.org/)

*By*: Jeffrey D Walker, PhD ([Walker Environmental Research LLC](https://walkerenvres.com)) in collaboration with Laura Diemer, Luke Frankel ([FB Environmental](https://www.fbenvironmental.com/))

Links:
- **Live Website**: http://data.prepestuaries.org/data-explorer/  
- **Development Website**: http://walkerenvres-prep.s3-website-us-east-1.amazonaws.com/
- **Developer Documentation**: https://github.com/walkerjeffd/prep-data-explorer/wiki

## Overview

This repo contains the source code for the Piscataqua Watershed Data Explorer. The PWDE is a client-side web application developed using Vue.js, Vuetify, and Vite. Data are loaded from a PostgREST API to the PREP Database. The primary goals of this application are to provide a user-friendly interface for exploring and downloading water quality data throughout the PREP region.

See the [Project Wiki](https://github.com/walkerjeffd/prep-data-explorer/wiki)  for more detail how the web application retrieves data from the PREP database and API.

## Project Setup

### Install Dependencies

First, install [Node.js](https://nodejs.org/en) (v18 or higher is recommended). Project was developed using the node version listed in `.tool-versions`, which can be used with [asdf version manager](https://github.com/asdf-vm/asdf).

After node is installed, install the dependencies using npm:

```sh
npm install
```

### Configuration

The application is configured using environment variables defined using `.env` files for each environment (e.g., `.env.development` for the development environment). These files are tracked in the git repo, and thus do not need to be created.

The following environment variables are required:

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

This application is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). See `LICENSE` for more information.
