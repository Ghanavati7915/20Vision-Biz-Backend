import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import FactorService from "./factor.service";
import { FactorController } from "./factor.controller";

@Module({
   controllers: [FactorController],
   providers: [FactorService, PrismaService],
   exports: [FactorService],
})
export class FactorModule {}
