## Run on Heroku:

### 1. Set environment variables

Log into heroku panel, and set Config vars:

GOOGLE_APPLICATION_CREDENTIALS = google-credentials.json
GOOGLE_CREDENTIALS = {the full contents as is of the google-credentials.json file}

### 2. Add the buildpack

heroku buildpacks:add https://github.com/bastronaut/heroku-google-application-credentials-buildpack.git

### 3. Deploy app on Heroku


## Development

### Watch for file changes:
```
watchify frontend/js/index.js -o frontend/js/bundle.js
```

### Compile one time js:
```
browserify frontend/js/index.js -o frontend/js/bundle.js
```


### Start local http server for frontend
```
http-server
```


### Start backend
```
nodemon app.js
```


TODO:
- swipe right for next audio file