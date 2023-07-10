require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mindsdb = require("./handlers/mindsdb");
const logger = require("./logger");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);

const app = express();

// Session middleware
app.use(
  session({
    secret: process.env.MAVATAR_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24 hours
    }),
  })
);

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the static files in public directory
app.use(express.static("public"));

// Initialize the avatar generation count in the session
app.use((req, res, next) => {
  if (!req.session.avatarGenerations && req.session.avatarGenerations !== 0) {
    req.session.avatarGenerations = 5;
  }
  next();
});

// Connect to MindsDB and start the server when connection is established
mindsdb
  .connectToMindsDB()
  .then(() => {
    app.listen(3000, () => {
      logger.info("Server listening on port 3000");
    });
  })
  .catch((err) => {
    logger.error("Error connecting to MindsDB: ", err);
    process.exit(1); // Terminate the app if there's an error connecting to MindsDB
  });

// Route for the homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Route to get the avatar count
app.get("/avatarCount", (req, res) => {
  res.json({ avatarGenerations: req.session.avatarGenerations });
});

app.post("/avatar", async (req, res) => {
  const inputText = req.body.inputText;
  const type = req.body.type;

  try {
    // Call a function from mindsdb.js with a timeout of 1 minute (60,000 milliseconds)
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("Avatar generation timed out"));
      }, 60000); // 1 minute timeout
    });

    const avatarPromise = mindsdb.generateAvatar(inputText, type);
    const avatar = await Promise.race([avatarPromise, timeoutPromise]);

    // Decrement the avatar generations count
    req.session.avatarGenerations--;

    // Send the avatar and avatarGenerations in the response
    res.send({ avatar, avatarGenerations: req.session.avatarGenerations });
  } catch (error) {
    logger.error("Error generating an Avatar: ", error);
    res
      .status(500)
      .send({ error: "An error occurred while generating an Avatar." });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error("An unhandled error occurred: ", err);
  res.status(500).send({ error: "Internal Server Error" });
});

// Keep the server running even after an unhandled exception
process.on("uncaughtException", (error) => {
  logger.error("An uncaught exception occurred: ", error);
});

// Keep the server running even after an unhandled promise rejection
process.on("unhandledRejection", (reason, promise) => {
  logger.error("An unhandled promise rejection occurred: ", reason);
});
