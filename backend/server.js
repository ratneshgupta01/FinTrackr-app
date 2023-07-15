const express = require("express");
const path = require("path");
const colors = require("colors");
const dotenv = require("dotenv");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDb = require("./config/db");
const { dirname } = require("path");
const cors = require("cors");
const port = process.env.PORT || 5000;
const url = process.env.MONGO_URI;
dotenv.config();
// require("./.env")
connectDb();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "https://fin-trackr-app.onrender.com"],
//   })
// );

app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Serve frontend
// if (process.env.NODE_ENV === "production") {
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(
    path.resolve(__dirname, "../", "frontend", "build", "index.html")
  )
);
// } else {
//   app.get("/", (req, res) => res.send("Please go in production."));
// }

app.use(errorHandler);

app.listen(port, () => console.log(`Server started at PORT: ${port}`));
