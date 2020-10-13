import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8081;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/filteredimage", async ( req, res ) => {
    const image_url = req.query.image_url;
    if(!image_url){
      res.status(200).send("Must include an image url.");
    }
    try {
      /*TODO Implement error handling if the url passed in is not an image
      I'm not a fan that if the url sent in is incomplete, the whole thing breaks.
      will most likely use a regex statement to fix this. */
      let filteredImageUrl = await filterImageFromURL(image_url);
      res.sendFile(filteredImageUrl, () => deleteLocalFiles([filteredImageUrl]))
    }
    catch(e) {
      console.log("Error: ", e);
      res.status(400).send("Error processing the image.")
    }
  } );

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();