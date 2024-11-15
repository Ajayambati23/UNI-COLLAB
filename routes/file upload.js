const express = require("express");
const { upload } = require("./cloudinary"); // Adjust the path as needed
const Collab = require("./models/unicollab"); // Your database model
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");

const app = express();

// Route for uploading a single file
app.post("/upload", upload.single("image"), catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const imageUrl = req.file.path; // URL of the uploaded image
    const newCollab = new Collab({ image: imageUrl /* other fields */ });
    await newCollab.save();

    return res.send("File uploaded successfully!");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error uploading file.");
  }
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err); // Log the error
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "OH NO!! Something went wrong";
  // Ensure you don't send a response after it has already been sent
  if (!res.headersSent) {
    res.status(statusCode).render("error", { err });
  }
});

// Listening on a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
