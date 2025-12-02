import {
  Category,
  City,
  Prisma,
  VenueType,
} from "../../generated/prisma/client";
import { ApiError } from "../../utils/api.error";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateEventDTO } from "./dto/create-event.dto";
import { GetEventsDTO } from "./dto/get-event.dto";
import { UpdateEventDTO } from "./dto/update.event";

export class EventService {
  prisma: PrismaService;
  cloudinaryService: CloudinaryService;

  constructor() {
    this.prisma = new PrismaService();
    this.cloudinaryService = new CloudinaryService();
  }
  getAllEvents = async (query: GetEventsDTO) => {
    const { page, take, sortBy, sortOrder, search, category } = query;

    const whereClause: Prisma.EventWhereInput = {
      deletedAt: null,
      ...(category && { category }), // filter by category if provided
      ...(search && {
        title: { contains: search, mode: "insensitive" }, // case-insensitive search
      }),
    };

    const events = await this.prisma.event.findMany({
      where: whereClause,
      take: take,
      skip: (page - 1) * take,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
    const total = await this.prisma.event.count({
      where: whereClause,
    });
    return {
      data: events,
      meta: {
        page,
        take,
        total,
        lastPage: Math.ceil(total / take),
      },
    };
  };

  getEventbyId = async (id: number) => {
    const event = await this.prisma.event.findFirst({
      where: { id, deletedAt: null },
      include: {
        organizer: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!event) throw new Error("Event not found");
    return event;
  };

  getEventbyTitle = async (title: string) => {
    const event = await this.prisma.event.findFirst({
      where: { title, deletedAt: null },
    });
    if (!event) throw new Error("title of event not found");
    return event;
  };

  createEvent = async (
    body: CreateEventDTO,
    banner: Express.Multer.File,
    organizerId: number
  ) => {
    const organizer = await this.prisma.user.findUnique({
      where: { id: organizerId },
    });

    if (!organizer || organizer.role !== "ORGANIZER") {
      throw new ApiError("Invalid organizer ID", 400);
    }
    const existingEvent = await this.prisma.event.findFirst({
      where: { title: body.title, date: body.date, deletedAt: null },
    });
    if (existingEvent) {
      throw new ApiError("title with date already exist", 400);
    }

    const { secure_url } = await this.cloudinaryService.upload(banner);

    const venueType = body.venueType as VenueType;
    if (venueType === "FREE") {
      body.price = 0;
    } else if (venueType === "PAID") {
      body.price = Number(body.price);
    }

    const availableSeat = body.availableSeats;
    if (!availableSeat || availableSeat <= 0) {
      throw new Error("Seat Availability must be provided");
    }

    return this.prisma.event.create({
      data: {
        title: body.title,
        banner: secure_url,
        description: body.description,
        category: body.category,
        date: new Date(body.date),
        startTime: body.startTime,
        endTime: body.endTime,
        venue: body.venue,
        city: body.city,
        address: body.address,
        venueType: body.venueType,
        availableSeats: Number(body.availableSeats),
        price: body.price,
        organizerId: organizerId,
      },
    });
  };

  updateEvent = async (
    id: number,
    body: Partial<UpdateEventDTO>,
    banner?: Express.Multer.File
  ) => {
    const currentEvent = await this.prisma.event.findFirst({
      where: { id },
    });
    if (!currentEvent) throw new Error("event not found");

    const data: any = {};
    if (body.title !== undefined) data.name = body.title;
    if (body.description !== undefined) data.description = body.description;
    if (body.price !== undefined) data.price = body.price;
    if (body.date !== undefined) data.date = new Date(body.date);
    if (body.availableSeats !== undefined)
      data.availableSeats = body.availableSeats;
    if (banner) {
      {
        const upload = await this.cloudinaryService.upload(banner);
        data.banner = upload.secure_url;
      }
      
      const updatedEvent = await this.prisma.event.update({
        where: { id },
        data,
      });
      return { message: "event updated succesfully", data: updatedEvent };
    }
  };
}
