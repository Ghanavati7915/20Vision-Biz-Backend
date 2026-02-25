import { Controller, Body, UseGuards, Request, Post, Patch, Param, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BranchService } from "./branch.service";
import {
   CreateBranchBankDto,
   CreateBranchPhonesDto,
   CreateDepartmentDto,
} from "./dto/branch.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Branch")
@ApiBearerAuth("JWT-auth")
@Controller("branch")
@UseGuards(JwtAuthGuard)
export class BranchController {
   constructor(private readonly branchService: BranchService) {}

   //#region Create Bank Phones
   @Post("Phones/:id")
   @ApiOperation({ summary: "Create a Branch Phones" })
   @ApiResponse({ status: 201, description: "Branch Phones created successfully" })
   @ApiResponse({ status: 400, description: "Bad request" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   create_phones(@Param("id") id: string, @Request() req: any, @Body() payload: CreateBranchPhonesDto) {
      return this.branchService.create_phones(req.user.id,req.user.isPersonal, req.user.userID, +id, payload);
   }
   //#endregion

   //#region Create Departments
   @Post("departments/:id")
   @ApiOperation({ summary: "Create a Branch Departments" })
   @ApiResponse({ status: 201, description: "Branch Departments created successfully" })
   @ApiResponse({ status: 400, description: "Bad request" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   create_department(@Param("id") id: string, @Request() req: any, @Body() payload: CreateDepartmentDto) {
      return this.branchService.create_department(req.user.id,req.user.isPersonal, req.user.userID, +id, payload);
   }
   //#endregion

   //#region Create Bank Accounts
   @Post("bankAccounts/:id")
   @ApiOperation({ summary: "Create a Branch Bank Accounts" })
   @ApiResponse({ status: 201, description: "Branch Bank Accounts created successfully" })
   @ApiResponse({ status: 400, description: "Bad request" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   create_bankAccounts(@Param("id") id: string, @Request() req: any, @Body() payload: CreateBranchBankDto) {
      return this.branchService.create_bankAccounts(req.user.id,req.user.isPersonal, req.user.userID, +id, payload);
   }
   //#endregion
}
