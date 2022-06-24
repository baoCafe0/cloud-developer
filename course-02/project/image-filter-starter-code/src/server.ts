import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import { Request, Response } from "express";
(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage",
    async (req: Request, res: Response) => {
      const regex: RegExp = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
      const image_url: string = req.query.image_url;
      if (image_url) {
        const result: RegExpMatchArray = image_url.toString().match(regex);
        if (!result) {
          res.send("the image url is not valid ")
        }
        else {
          const imageFilter: string = await filterImageFromURL(image_url);
          if (imageFilter) {
            return res.status(200).sendFile(imageFilter.toString(), (err: Error) => {
              if (err) {
                res.status(500).send("Somethings went wrong");
              }
              deleteLocalFiles([imageFilter]);
            });
          }
          else {
            return res.status(400).send("No imaged filter");
          }
        }
      }
      else {
        return res.send("the image url is not found")
      }
    })

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();