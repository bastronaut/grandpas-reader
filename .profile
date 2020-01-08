# .sh to be run on startup
# ephemereal read only filesystem?
#echo "The credentials:"
#echo ${GOOGLE_CREDENTIALS}

#echo ${GOOGLE_CREDENTIALS} > /google-credentials.json

# heroku config:set GOOGLE_APPLICATION_CREDENTIALS=/google-credentials.json"

heroku config:get GITHUB_USERNAME
echo "credentials present:"
cat google-credentials.json
ls