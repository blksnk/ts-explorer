import express, { type Express } from "express";
import { fileRouter, projectRouter } from "./routers";
import cors from "cors";
import { Logger } from "@ubloimmo/front-util";
import { morgan } from "./middlewares";

const logger = Logger();

const app: Express = express();
const port = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan);

app.use("/projects", projectRouter);
app.use("/files", fileRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start server
app.listen(port, () => {
  logger.log(`Server running on port ${port}`, "server");
});

export default app;
