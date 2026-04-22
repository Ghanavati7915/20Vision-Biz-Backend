import { Controller, Body, UseGuards, Request, Post, Patch, Param, Get, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BranchService } from "./branch.service";
import {
  CreateBranchDto,
  CreateBranchBankDto,
  CreateBranchPhonesDto,
  CreateDepartmentDto, CreateBranchSocialAccountsDto, CreateBranchDepartmentEmployeesDto,
} from './dto/branch.dto';
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AddressDto } from '../common/DTOs/shared';

@ApiTags("Branch")
@ApiBearerAuth("JWT-auth")
@Controller("branch")
@UseGuards(JwtAuthGuard)
export class BranchController {
   constructor(private readonly branchService: BranchService) {}

  //#region Branch
    //#region Create
    @Post(':Contact_id')
    @ApiOperation({ summary: 'Create a new Branch Contact' })
    @ApiResponse({ status: 201, description: 'Branch created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(@Param('Contact_id') id: string,@Request() req: any, @Body() payload: CreateBranchDto) {
      return this.branchService.create(req.user.id,req.user.userID,+id,payload);
    }
    //#endregion
    //#region Get
  @Get(':entity/:branch_id')
  @ApiOperation({ summary: 'Get Branches' })
  @ApiResponse({ status: 200, description: 'Branch returned successfully' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  get_branches(@Request() req: any, @Param('entity') entity: string, @Param('branch_id') id: string) {
    return this.branchService.get_branches(req.user.id,entity,+id);
  }
  //#endregion
    //#region Update
    @Patch(':branch_id')
    @ApiOperation({ summary: 'Update a Branch' })
    @ApiResponse({ status: 201, description: 'Branch updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    update_branch(@Request() req: any, @Body() payload: CreateBranchDto, @Param('branch_id') id: string) {
      return this.branchService.update_branch(req.user.id,req.user.userID,+id,payload);
    }
    //#endregion
    //#region Delete
    @Delete(':branch_id')
    @ApiOperation({ summary: 'Delete a Branch' })
    @ApiResponse({ status: 201, description: 'Branch deleted successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    delete_branch(@Request() req: any, @Param('branch_id') id: string) {
      return this.branchService.delete_branch(req.user.id,req.user.userID,+id);
    }
    //#endregion
  //#endregion

  //#region Branch : Address
    //#region Get
  @Get(':branch_id/address')
  @ApiOperation({ summary: 'Get Branch Address' })
  @ApiResponse({ status: 200, description: 'Branch Address returned successfully' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  get_branchAddress(@Request() req: any, @Param('branch_id') id: string) {
    return this.branchService.get_branchAddress(req.user.id,+id);
  }
  //#endregion
    //#region Update
  @Patch(':branch_id/address')
  @ApiOperation({ summary: 'Update a Branch Address' })
  @ApiResponse({ status: 201, description: 'Branch Address updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update_branchAddress(@Request() req: any, @Body() payload: AddressDto, @Param('branch_id') id: string) {
    return this.branchService.update_branchAddress(req.user.id,req.user.userID,+id,payload);
  }
  //#endregion
  //#endregion

  //#region Branch : Phones
    //#region Create
    @Post(":branch_id/Phone")
    @ApiOperation({ summary: "Create a Branch Phone" })
    @ApiResponse({ status: 201, description: "Branch Phone created successfully" })
    @ApiResponse({ status: 400, description: "Bad request" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    create_phones(@Param("branch_id") branch_id: string, @Request() req: any, @Body() payload: CreateBranchPhonesDto) {
      return this.branchService.create_phones(req.user.id, req.user.userID, +branch_id, payload);
    }
    //#endregion
    //#region Get
    @Get(':branch_id/Phone')
    @ApiOperation({ summary: 'Get Branch Phones' })
    @ApiResponse({ status: 200, description: 'Branch Phones returned successfully' })
    @ApiResponse({ status: 404, description: 'Not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    get_phones(@Request() req: any, @Param('branch_id') branch_id: string) {
      return this.branchService.get_phones(req.user.id,+branch_id);
    }
    //#endregion
    //#region Update
  @Patch(':branch_id/Phone/:id')
  @ApiOperation({ summary: 'Update a Branch Phone' })
  @ApiResponse({ status: 201, description: 'Branch Phone updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update_phones(@Request() req: any,@Param("branch_id") branch_id: string, @Body() payload: CreateBranchPhonesDto, @Param('id') id: string) {
    return this.branchService.update_phones(req.user.id,req.user.userID,+branch_id,+id,payload);
  }
  //#endregion
    //#region Delete
  @Delete(':branch_id/Phone/:id')
  @ApiOperation({ summary: 'Delete a Branch Phone' })
  @ApiResponse({ status: 201, description: 'Branch Phone deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete_phones(@Request() req: any, @Param('branch_id') branch_id: string, @Param('id') id: string) {
    return this.branchService.delete_phones(req.user.id,req.user.userID,+branch_id,+id);
  }
  //#endregion
  //#endregion

  //#region Branch : Bank Accounts
  //#region Create
  @Post(":branch_id/bankAccounts")
  @ApiOperation({ summary: "Create a Branch Bank Account" })
  @ApiResponse({ status: 201, description: "Branch Bank Account created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  create_bankAccounts(@Param("branch_id") branch_id: string, @Request() req: any, @Body() payload: CreateBranchBankDto) {
    return this.branchService.create_bankAccounts(req.user.id, req.user.userID, +branch_id, payload);
  }
  //#endregion
  //#region Get
  @Get(':branch_id/bankAccounts')
  @ApiOperation({ summary: 'Get Branch Bank Accounts' })
  @ApiResponse({ status: 200, description: 'Branch Bank Accounts returned successfully' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  get_bankAccounts(@Request() req: any, @Param('branch_id') branch_id: string) {
    return this.branchService.get_bankAccounts(req.user.id,+branch_id);
  }
  //#endregion
  //#region Update
  @Patch(':branch_id/bankAccounts/:id')
  @ApiOperation({ summary: 'Update a Branch Bank Account' })
  @ApiResponse({ status: 201, description: 'Branch Bank Account updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update_bankAccounts(@Request() req: any,@Param("branch_id") branch_id: string, @Body() payload: CreateBranchBankDto, @Param('id') id: string) {
    return this.branchService.update_bankAccounts(req.user.id,req.user.userID,+branch_id,+id,payload);
  }
  //#endregion
  //#region Delete
  @Delete(':branch_id/bankAccounts/:id')
  @ApiOperation({ summary: 'Delete a Branch Bank Account' })
  @ApiResponse({ status: 201, description: 'Branch Bank Account deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete_bankAccounts(@Request() req: any, @Param('branch_id') branch_id: string, @Param('id') id: string) {
    return this.branchService.delete_bankAccounts(req.user.id,req.user.userID,+branch_id,+id);
  }
  //#endregion
  //#endregion

  //#region Branch : Departments
  //#region Create
  @Post(":branch_id/departments")
  @ApiOperation({ summary: "Create a Branch Department" })
  @ApiResponse({ status: 201, description: "Branch Department created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  create_department(@Param("branch_id") branch_id: string, @Request() req: any, @Body() payload: CreateDepartmentDto) {
    return this.branchService.create_department(req.user.id, req.user.userID, +branch_id, payload);
  }
  //#endregion
  //#region Get
  @Get(':branch_id/departments')
  @ApiOperation({ summary: 'Get Branch Department' })
  @ApiResponse({ status: 200, description: 'Branch Department returned successfully' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  get_department(@Request() req: any, @Param('branch_id') branch_id: string) {
    return this.branchService.get_department(req.user.id,+branch_id);
  }
  //#endregion
  //#region Update
  @Patch(':branch_id/departments/:id')
  @ApiOperation({ summary: 'Update a Branch Department' })
  @ApiResponse({ status: 201, description: 'Branch Department updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update_department(@Request() req: any,@Param("branch_id") branch_id: string, @Body() payload: CreateDepartmentDto, @Param('id') id: string) {
    return this.branchService.update_department(req.user.id,req.user.userID,+branch_id,+id,payload);
  }
  //#endregion
  //#region Delete
  @Delete(':branch_id/departments/:id')
  @ApiOperation({ summary: 'Delete a Branch Department' })
  @ApiResponse({ status: 201, description: 'Branch Department deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete_department(@Request() req: any, @Param('branch_id') branch_id: string, @Param('id') id: string) {
    return this.branchService.delete_department(req.user.id,req.user.userID,+branch_id,+id);
  }
  //#endregion
  //#endregion

  //#region Branch : SocialAccounts
  //#region Create
  @Post(":branch_id/socialAccounts")
  @ApiOperation({ summary: "Create a Branch socialAccounts" })
  @ApiResponse({ status: 201, description: "Branch socialAccounts created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  create_socialAccounts(@Param("branch_id") branch_id: string, @Request() req: any, @Body() payload: CreateBranchSocialAccountsDto) {
    return this.branchService.create_socialAccounts(req.user.id, req.user.userID, +branch_id, payload);
  }
  //#endregion
  //#region Get
  @Get(':branch_id/socialAccounts')
  @ApiOperation({ summary: 'Get Branch socialAccounts' })
  @ApiResponse({ status: 200, description: 'Branch socialAccounts returned successfully' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  get_socialAccounts(@Request() req: any, @Param('branch_id') branch_id: string) {
    return this.branchService.get_socialAccounts(req.user.id,+branch_id);
  }
  //#endregion
  //#region Update
  @Patch(':branch_id/socialAccounts/:id')
  @ApiOperation({ summary: 'Update a Branch socialAccounts' })
  @ApiResponse({ status: 201, description: 'Branch socialAccounts updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update_socialAccounts(@Request() req: any,@Param("branch_id") branch_id: string, @Body() payload: CreateBranchSocialAccountsDto, @Param('id') id: string) {
    return this.branchService.update_socialAccounts(req.user.id,req.user.userID,+branch_id,+id,payload);
  }
  //#endregion
  //#region Delete
  @Delete(':branch_id/socialAccounts/:id')
  @ApiOperation({ summary: 'Delete a Branch socialAccounts' })
  @ApiResponse({ status: 201, description: 'Branch socialAccounts deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete_socialAccounts(@Request() req: any, @Param('branch_id') branch_id: string, @Param('id') id: string) {
    return this.branchService.delete_socialAccounts(req.user.id,req.user.userID,+branch_id,+id);
  }
  //#endregion
  //#endregion

  //#region Branch : Department Employees
  //#region Create
  @Post(":department_id/departmentEmployee")
  @ApiOperation({ summary: "Create a Department Employee" })
  @ApiResponse({ status: 201, description: "Branch Department Employee created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  create_departmentEmployee(@Param("department_id") department_id: string, @Request() req: any, @Body() payload: CreateBranchDepartmentEmployeesDto) {
    return this.branchService.create_departmentEmployee(req.user.userID, +department_id, payload);
  }
  //#endregion
  //#region Get
  @Get(':department_id/departmentEmployee')
  @ApiOperation({ summary: 'Get Branch Department Employees' })
  @ApiResponse({ status: 200, description: 'Branch Department Employees returned successfully' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  get_departmentEmployee(@Param('department_id') department_id: string) {
    return this.branchService.get_departmentEmployee(+department_id);
  }
  //#endregion
  //#region Update
  @Patch(':department_id/departmentEmployee/:id')
  @ApiOperation({ summary: 'Update a Branch Department Employee' })
  @ApiResponse({ status: 201, description: 'Branch Department Employee updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update_departmentEmployee(@Request() req: any,@Param("department_id") department_id: string, @Body() payload: CreateBranchDepartmentEmployeesDto, @Param('id') id: string) {
    return this.branchService.update_departmentEmployee(req.user.userID,+department_id,+id,payload);
  }
  //#endregion
  //#region Delete
  @Delete(':department_id/departmentEmployee/:id')
  @ApiOperation({ summary: 'Delete a Branch Department Employee' })
  @ApiResponse({ status: 201, description: 'Branch Department Employee deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete_departmentEmployee(@Request() req: any, @Param('department_id') department_id: string, @Param('id') id: string) {
    return this.branchService.delete_departmentEmployee(req.user.userID,+department_id,+id);
  }
  //#endregion
  //#endregion

}
