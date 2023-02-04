import express from "express";
import cors from "cors";
import * as dotenv from 'dotenv' 
import routes from './routes'

dotenv.config()

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  exposedHeaders: ["Content-Length"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use("/arweave", ...arweaveRoutes);

// Error handler
//app.use(errorMiddleware);


app.use("/files", routes);


const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});