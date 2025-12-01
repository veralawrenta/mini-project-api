import { plainToInstance } from "class-transformer";
import { Request, Response } from "express";
import { Category } from "../../generated/prisma/enums";
import { ApiError } from "../../utils/api.error";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { GetEventsDTO } from "./dto/get-event.dto";
import { EventService } from "./event.services";

export class EventController {
  eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }
  getAllEvents = async (req: Request, res: Response) => {
    const query = plainToInstance(GetEventsDTO, req.query);
    const result = await this.eventService.getAllEvents(query);
    return res.status(200).send(result);
  };

  getEventById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const event = await this.eventService.getEventbyId(id);

      return res.status(200).send(event);
    } catch (err: any) {
      return res.status(400).send({ message: err.message });
    };
  }
  
  getEventByTitle = async (req: Request, res: Response) => {
    try {
      const { title } = req.query;

      if (!title || typeof title !== "string") {
        return res.status(400).send({ message: "Title query parameter is required and must be a string." });
      }

      const event = await this.eventService.getEventbyTitle(title);

      return res.status(200).send(event);
    } catch (err: any) {
      return res.status(400).send({ message: err.message });
    };
  }

  createEvent = async (req: Request, res: Response) => {
    try {
      const organizerId = 3; // Temporary hardcoded organizer ID
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const banner = files.banner?.[0];
      if (!banner) {
        throw new ApiError("Thumbnail is required", 400);
      }

      /*const organizerId = Number(res.locals.user?.id);
      if (!organizerId) {
        throw new ApiError("Unauthorized", 401);
      }*/

      if (!req.body) {
        return res.status(400).send({ message: "Event data is required" });
      }
      const result = await this.eventService.createEvent(
        req.body,
        banner,
        organizerId
      );
      return res.status(201).send({
        success: true,
        message: "Event created successfully!",
        data: result,
      });
    } catch (error) {
      return res.status(500).send({ message: (error as Error).message });
    };
  };

  updateEvent = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const user = res.locals.user;
      const organizerId = Number(user?.id);

      /*if (user.role !== "ORGANIZER") {
        return res.status(403).send({message: "You are not authorized to update event."});
      }*/

      
      if (!data || Object.keys(data).length === 0) {
        return res
          .status(400)
          .send({ message: "No data provided for update." });
      }

      const result = await this.eventService.updateEvent (id, {
        ...data,
        organizer_id: organizerId,
      });

      return res.status(200).send(result);
    } catch (err: any) {
      return res.status(400).send({ message: err.message });
    }
  };
}
