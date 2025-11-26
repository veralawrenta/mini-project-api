import express, { Express } from "express";
import { PORT } from './config/env';
import cors from 'cors';
import {SampleRouter} from './modules/sample/sample.router';
import { errorMiddleware } from "./middlewares/error.middleware";

export class App {
  app: Express;

  constructor() {    // constructor akan jalan setelah kita initialize class app
    this.app = express();
    this.configure();
    this.routes();
  }

  private configure() {
    // ini hanya digunakan disini saja jadi dibuat private
    this.app.use(express.json());
    this.app.use(cors());
    this.handleError()
  }

  private routes (){
    const sampleRouter = new SampleRouter();

    this.app.use("/samples", sampleRouter.getRouter())

  }

  private handleError(){
    this.app.use(errorMiddleware);
  }

  start() {
    this.app.listen(PORT, () => 
    console.log (`Server running on port : ${PORT}`))
  }
}
