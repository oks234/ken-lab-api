import express from "express";
import bibleTodayRouter from "./routers/bibleTodayRouter";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/bible-today", bibleTodayRouter);

app.listen(port, () => {
  console.log(`Example app listenisng on port ${port}`);
});
