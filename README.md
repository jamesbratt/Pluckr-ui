## Pluckr UI

A React/Redux app that models third party data on the client so that it can be transformed and visualised using JavaScript charting libraries.

### Introduction

[![Watch the introduction to Pluckr](https://img.youtube.com/vi/kEnj0gdK2iM/hqdefault.jpg)](https://youtu.be/kEnj0gdK2iM)

### Tutorials

[![Watch Pluckr tutorial 1](https://img.youtube.com/vi/uBpoy1Jbvf4/mqdefault.jpg)](https://youtu.be/uBpoy1Jbvf4)
[![Watch Pluckr tutorial 2](https://img.youtube.com/vi/neRZ-2CD5_w/mqdefault.jpg)](https://youtu.be/neRZ-2CD5_w)
[![Watch Pluckr tutorial 3](https://img.youtube.com/vi/0eBTP264oBE/mqdefault.jpg)](https://youtu.be/0eBTP264oBE)
[![Watch Pluckr tutorial 4](https://img.youtube.com/vi/urUJobXVI2Y/mqdefault.jpg)](https://youtu.be/urUJobXVI2Y)

### Local setup

To run locally, start by creating an `.env.local` file in the project root,
containing the following:

```
REACT_APP_PLUCKR_API_URI=https://api.pluckr.io
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
