import { SampleController } from "./sample.controllers"
import { Router } from "express"

export class SampleRouter {
    router: Router
    sampleController : SampleController

    constructor () {
        this.router = Router();
        this.sampleController = new SampleController();
        this.initRoutes() //harus dibawah samplecontroller
    }

    private initRoutes = () =>{
        this.router.get('/', this.sampleController.getSamples)
    }

    getRouter = () => {
        return this.router;
    }
}
