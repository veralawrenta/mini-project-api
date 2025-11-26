import { Request, Response } from "express";
import { SampleService } from "./sample.services";

export class SampleController {
    sampleService: SampleService;

    constructor() {
        this.sampleService = new SampleService();
    }
    getSamples = async (req: Request, res: Response) => {
        const result = await this.sampleService.getSample();
        return res.status(200).send(result);
    }
}