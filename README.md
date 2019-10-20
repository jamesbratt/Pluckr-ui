## Pluckr UI

A React/Redux app that models third party data on the client so that it can be transformed and visualised using JavaScript charting libraries.

To run locally, start by creating an `.env.local` file in the project root,
containing the following:

```
REACT_APP_PLUCKR_API_URI=https://app.pluckr.io
REACT_APP_REDIRECT_URI=http://localhost:3000
```

If you have the Pluckr API running locally then instead use:

```
REACT_APP_PLUCKR_API_URI=http://localhost:3000
REACT_APP_REDIRECT_URI=http://localhost:3000
```

In the project directory, you can then run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.