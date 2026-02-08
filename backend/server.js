require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect(process.env.MONGO_URI_TEST)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(3000, () => {
      console.log("API running on http://localhost:3000");
    });
  })
  .catch(console.error);
