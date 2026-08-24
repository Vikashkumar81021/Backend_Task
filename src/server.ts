import "dotenv/config";
import app from "./app.ts";
import prisma from "./config/database.ts";

const PORT = Number(process.env.PORT) || 3000;

const startServer = async () => {
  try {
    await prisma.$connect();

    console.log("Database Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
startServer();
