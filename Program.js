const express  = require( 'express' );
const PhotoController = require("./PhotoController.js");
const https = require("https");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

const ssloptions = 
{
  key: fs.readFileSync("/etc/ssl/certs/tls.key"),
  cert: fs.readFileSync("/etc/ssl/certs/tls.crt")
}


app.use("/photo", PhotoController);


https.createServer(ssloptions, app).listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});


