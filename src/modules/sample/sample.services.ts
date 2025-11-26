import { PrismaService } from "../prisma/prisma.service";

export class SampleService {
    prisma: PrismaService;


    constructor() {
        this.prisma = new PrismaService; // karna itu kelas jadi di constructor jadi new prismaservice
    }
    getSamples = async () => {
        const samples= await this.prisma.sample.findMany();
        return samples
    }


    getSample = async () => {
        //const sample = await this.prisma.sample.find
    };
    
    
    createSamples = () => {};
  }