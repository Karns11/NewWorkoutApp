import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import connectDb from "./config/connectDB.js";

const port = process.env.PORT || 5000;

connectDb();

const app = express();

//These two lines allow use to send form data and parse the req.body that is being sent.
//if we didn't add this, then for ex, when we make a post request to our register route with nothing in the body, we get undefined
// -- since we added this, now if we were to do that ^ then we get an empty object which is what we want
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
