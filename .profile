# .sh to be run on startup

echo "the creds:"
echo ${GOOGLE_CREDENTAILS}

echo ${GOOGLE_CREDENTIALS} > /google-credentials.json
${GOOGLE_APPLICATION_CREDENTIALS} = /google-credentials.json

echo "stored application credentials"
ls