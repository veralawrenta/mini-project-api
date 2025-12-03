import { Router } from "express";
import { EventController } from "./event.controllers";
import { UploaderMiddleware } from "../../middlewares/uploader.middleware";

export class EventRouter {
    router: Router
    eventController : EventController
    uploaderMiddleware: UploaderMiddleware

    constructor () {
        this.router = Router();
        this.eventController = new EventController();
        this.uploaderMiddleware = new UploaderMiddleware();
        this.initRoutes()
    }

    private initRoutes = () =>{
        this.router.get('/', this.eventController.getAllEvents)
        this.router.get('/:id', this.eventController.getEventById)
        this.router.get('/title',this.eventController.getEventByTitle)
        this.router.post(
            "/",
            //this.jwtMiddleware.verifyToken(process.env.JWT_SECRET!),
            this.uploaderMiddleware
              .upload()
              .fields([{ name: "banner", maxCount: 1 }]),
            this.eventController.createEvent
        );
        this.router.patch('/:id', this.eventController.updateEvent)
        this.router.get("/organizer/:id", this.eventController.getEventsByOrganizer);
    }

    getRouter = () => {
        return this.router;
    }
}
