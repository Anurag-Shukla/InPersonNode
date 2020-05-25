const https = require('./src/server.js');

const port = process.env.PORT || 8000;

// Server
https.listen(port, () => {
   console.log(`Listening on: ${port}`);
});

