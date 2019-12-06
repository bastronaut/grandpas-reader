
compile js:
```
browserify js/index.js -o js/bundle.js
```

Watch for file changes:
```
watchify js/index.js -o js/bundle.js
```


Start local http server for frontend
```
http-server
```


Start backend
```
nodemon app.js
```