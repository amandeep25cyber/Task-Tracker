import dotenv from "dotenv";
import { connectDB } from "./src/db/connection.db.js";
import { app } from "./app.js";

dotenv.config({
  path: "/.env",
});

const port = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at port:${port}`);
  });
}).catch((error)=>{
    console.log("Server to DB connection: "+error);
})
