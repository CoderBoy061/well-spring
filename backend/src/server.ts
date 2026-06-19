import dotenv from "dotenv";
import { sequelize } from "./config/database";
dotenv.config();
import "./models";
import app from "./app";
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
    app.listen(PORT, () => {
      console.log(
        `${process.env.NODE_ENV || "development"} server running on port ${PORT}`,
      );
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

startServer();
