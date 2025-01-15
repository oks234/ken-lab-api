import cors from "cors";
import express from "express";
import bibleTodayRouter from "./routers/bibleTodayRouter";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(
  "/bible-today",
  cors({
    origin: [
      "http://localhost:5173",
      "https://ken-lab-8f5f1.web.app",
      "https://ken-lab-8f5f1.firebaseapp.com",
    ],
  }),
  bibleTodayRouter
);

app.listen(port, () => {
  console.log(`Example app listenisng on port ${port}`);
});
