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