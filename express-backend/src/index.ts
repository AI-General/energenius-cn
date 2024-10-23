import * as express from "express";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import authRouter from "./routes/auth";
import * as cors from "cors";
import buildingsRouter from "./routes/buildings.routes";
import locationsRouter from "./routes/locations.routes";
const nodemailer = require("nodemailer");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
// const { GridFsStorage } = require("multer-gridfs-storage");
// const Grid = require("gridfs-stream");
const methodOverride = require("method-override");

const mongoURI = process.env.MONGODB_URI;

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const PORT = 5001;
    require("dotenv").config({ path: ".env.local" });
    app.use(function (req, res, next) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
      res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      next();
    });
    app.use(cors({ origin: "*" }));
    app.use(bodyParser.json());
    app.use(methodOverride("_method"));
    app.use(authRouter);
    app.use(buildingsRouter);
    app.use(locationsRouter);
    app.get("/health-check", (req: Request, res: Response) => res.send("OK -- CICD TEST 2 EXPRESS BE"));

    const conn = mongoose.createConnection(mongoURI);

    // let gfs: any, gridfsBucket: any;
    // conn.once("open", () => {
    //   gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    //     bucketName: "files",
    //   });

    //   gfs = Grid(conn.db, mongoose.mongo);
    //   gfs.collection("files");
    // });

    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_ACCESS_SECRET,
      region: process.env.REGION_NAME,
    });
    const s3 = new aws.S3();

    // Create storage engine - mongodb
    // const storage = new GridFsStorage({
    //   url: mongoURI,
    //   file: (req: Request, file) => {
    //     const { userId, locationName } = req.params;
    //     return new Promise((resolve, reject) => {
    //       crypto.randomBytes(16, (err, buf) => {
    //         if (err) {
    //           return reject(err);
    //         }
    //         if (file.mimetype.split("/")[0] === "image") {
    //           const filename = `${userId}/${locationName}/floormap.png`;
    //           const fileInfo = {
    //             filename: filename,
    //             bucketName: "files",
    //             metadata: { userId, locationName },
    //           };
    //           resolve(fileInfo);
    //         } else {
    //           const filename = `${userId}/${locationName}/dataFile.csv`;
    //           const fileInfo = {
    //             filename: filename,
    //             bucketName: "files",
    //             metadata: { userId, locationName },
    //           };
    //           resolve(fileInfo);
    //         }
    //       });
    //     });
    //   },
    // });
    // const upload = multer({ storage });

    const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

    const upload = multer({
      storage: multerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set content type
        key: (req: Request, file: any, cb: any) => {
          console.log("request", req.params);
          console.log("Uploading file:", file.originalname);
          if (file.mimetype.split("/")[0] === "image") {
            const userEmail = req.params.userEmail;
            const locationName = req.params.locationName;
            const filePath = `${userEmail}/${locationName}/floormap.png`;
            cb(null, filePath);
          } else {
            const userEmail = req.params.userEmail;
            const locationName = req.params.locationName;
            const filePath = `${userEmail}/${locationName}/dataFile.csv`;
            cb(null, filePath);
          }
        },
      }),
    });

    app.post("/upload/file/:userEmail/:locationName", upload.single("file"), (req, res) => {
      try {
        res.status(200).json({ message: "File uploaded successfully" });
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // app.get("/file/:type/:userId/:locationName", async (req, res) => {
    //   const { type } = req.params;
    //   if (type === "floorMap") {
    //     try {
    //       const { userId, locationName } = req.params;
    //       const file = await gfs.files.findOne({ filename: `${userId}/${locationName}/floormap.png` });
    //       const readStream = gridfsBucket.openDownloadStream(file._id);
    //       readStream.pipe(res);
    //     } catch (err) {
    //       res.json({ err });
    //     }
    //   } else {
    //     try {
    //       const { userId, locationName } = req.params;
    //       const file = await gfs.files.findOne({ filename: `${userId}/${locationName}/dataFile.csv` });

    //       if (!file) {
    //         return res.status(404).json({ err: "No file exists" });
    //       }

    //       // Set the appropriate content type for CSV
    //       res.set("Content-Type", "text/csv");
    //       res.set("Content-Disposition", `attachment; filename="${userId}/${locationName}/dataFile.csv"`);

    //       const readStream = gridfsBucket.openDownloadStream(file._id);
    //       readStream.pipe(res);
    //     } catch (err) {
    //       res.status(500).json({ err });
    //     }
    //   }
    // });

    // app.get("/files", async (req, res) => {
    //   try {
    //     let files = await gfs.files.find().toArray();
    //     res.json({ files });
    //   } catch (err) {
    //     res.json({ err });
    //   }
    // });

    const sendUserConfirmationEmail = async (req: Request, res: Response) => {
      const userEmail = req.query.email;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: "587",
        secure: false,
        auth: {
          user: "titusjay68@gmail.com",
          pass: "zliiziljmlymirzo",
        },
      });

      const mailOptions = {
        from: "info@energenius.com",
        to: String(userEmail),
        subject: "ENERGENIUS - DEMO REQUEST",
        html: `<p>Thank you for submitting a demo request.</p><br /> <p>Click <a href='https://energenius-delta.vercel.app/en-US/sign-up?email=${userEmail}' target='_blank' rel='noopener noreferrer'>here</a> to set up an account and try out energenius.</p>`,
      };

      await transporter.sendMail(mailOptions);

      res.send("Email sent");
    };
    app.get("/book-demo", sendUserConfirmationEmail);
    app.listen(PORT);
    console.log(`Express server has started on port ${PORT}. Open http://localhost:${PORT} to see results`);
  })
  .catch((error) => console.log(error));
