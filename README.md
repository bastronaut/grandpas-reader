# Google credentials

Requires setting the credentials in environment variables.

Log into heroku panel, and set Config vars:

```
heroku config:set GOOGLE_CREDENTIALS={the json content of the google credentials file}
```


example:
https://medium.com/@michaelhays_84022/heres-a-much-simpler-and-more-secure-solution-dedfd792caf9


Frontend needs to be recompiled into a bundle upon changes

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