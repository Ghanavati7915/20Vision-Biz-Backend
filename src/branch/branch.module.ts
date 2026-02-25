import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { BranchService } from "./branch.service";
import { BranchController } from "./branch.controller";

@Module({
   controllers: [BranchController],
   providers: [BranchService, PrismaService],
   exports: [BranchService],
})
export class BranchModule {}
