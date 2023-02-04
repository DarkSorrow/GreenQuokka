import { Router } from "express";
import {
    uploadMedusa
} from "../controllers";

const routers = Router();

routers.post("/medusa", uploadMedusa);
// routers.get("/contract", contract);

export default routers;
