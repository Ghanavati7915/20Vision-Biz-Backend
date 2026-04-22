import { Controller, Body, UseGuards, Request, Post, Patch, Param, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ContactService } from "./contact.service";
import { ContactCompanyDto, ContactUserDto, FilterContactDto } from "./dto/contact.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ToggleStateDto } from "src/common/DTOs/shared";

@ApiTags("Contact")
@ApiBearerAuth("JWT-auth")
@Controller("contact")
@UseGuards(JwtAuthGuard)
export class ContactController {
   constructor(private readonly contactService: ContactService) {}

   //#region Create User Contact
   @Post("user")
   @ApiOperation({ summary: "ایجاد مخاطب حقیقی" })
   @ApiResponse({
      status: 201,
      description: "User Contact created successfully",
   })
   @ApiResponse({ status: 400, description: "Bad request" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   createUser(@Request() req: any, @Body() payload: ContactUserDto) {
      return this.contactService.createUser(req.user.id, req.user.userID, payload);
   }
   //#endregion

   //#region Create Company Contact
   @Post("company")
   @ApiOperation({ summary: "ایجاد مخاطب حقوقی" })
   @ApiResponse({
      status: 201,
      description: "Company Contact created successfully",
   })
   @ApiResponse({ status: 400, description: "Bad request" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   createCompany(@Request() req: any, @Body() payload: ContactCompanyDto) {
      return this.contactService.createCompany(req.user.id, req.user.userID, payload);
   }
   //#endregion

  //#region User Update
  @Patch("user/:id")
  @ApiOperation({ summary: "ویرایش مخاطب حقیقی" })
  @ApiResponse({
    status: 201,
    description: "User Contact Customer updated successfully",
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  updateUser(@Request() req: any, @Body() payload: ContactUserDto, @Param("id") id: string) {
    return this.contactService.updateUser(req.user.id, req.user.userID, payload, +id);
  }
  //#endregion

  //#region Company Update
  @Patch("company/:id")
  @ApiOperation({ summary: "ویرایش مخاطب حقوقی" })
  @ApiResponse({
    status: 201,
    description: "Company Contact Customer updated successfully",
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  updateCompany(@Request() req: any, @Body() payload: ContactCompanyDto, @Param("id") id: string) {
    return this.contactService.updateCompany(req.user.id, req.user.userID, payload, +id);
  }
  //#endregion

   //#region Toggle Company Customer State
   @Patch("company/toggleCustomer/:id")
   @ApiOperation({ summary: "تغییر وضعیت مشتری بودن/نبودن یک مخاطب حقوقی" })
   @ApiResponse({
      status: 201,
      description: "Company Contact Customer State updated successfully",
   })
   @ApiResponse({ status: 400, description: "Bad request" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   toggleCompanyCustomerState(@Request() req: any, @Body() payload: ToggleStateDto, @Param("id") id: string) {
      return this.contactService.toggleCompanyCustomerState(req.user.id, req.user.userID, payload, +id);
   }
   //#endregion

   //#region Toggle User Customer State
   @Patch("user/toggleCustomer/:id")
   @ApiOperation({ summary: "تغییر وضعیت مشتری بودن/نبودن یک مخاطب حقیقی" })
   @ApiResponse({
      status: 201,
      description: "User Contact Customer State updated successfully",
   })
   @ApiResponse({ status: 400, description: "Bad request" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   toggleUserCustomerState(@Request() req: any, @Body() payload: ToggleStateDto, @Param("id") id: string) {
      return this.contactService.toggleUserCustomerState(req.user.id, req.user.userID, payload, +id);
   }
   //#endregion

   //#region Find Company By National Code
   @Get("company/find/:nationalCode")
   @ApiOperation({ summary: "دریافت اطلاعات شرکت بواسطه شناسه ملی" })
   @ApiResponse({
      status: 201,
      description: "Company Founded successfully",
   })
   @ApiResponse({ status: 400, description: "Bad request" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   findCompanyByNationalCode(@Param("nationalCode") nationalCode: string) {
      return this.contactService.findCompanyByNationalCode(nationalCode);
   }
   //#endregion

   //#region Find Company By National Code
   @Get("user/find/:mobile")
   @ApiOperation({ summary: "دریافت اطلاعات شخص بواسطه موبایل" })
   @ApiResponse({
      status: 201,
      description: "User Founded successfully",
   })
   @ApiResponse({ status: 400, description: "Bad request" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   findUserByMobile(@Param("mobile") mobile: string) {
      return this.contactService.findUserByMobile(mobile);
   }
   //#endregion

   //#region Get User Contact Data By ID
   @Get("user/:id")
   @ApiOperation({ summary: "دریافت اطلاعات کاربر حقیقی" })
   @ApiResponse({ status: 200, description: "User details" })
   @ApiResponse({ status: 404, description: "User not found" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   getUser(@Request() req: any, @Param("id") id: string) {
      return this.contactService.getUser(req.user.id, +id);
   }
   //#endregion

   //#region Get Company Contact Data By ID
   @Get("company/:id")
   @ApiOperation({ summary: "دریافت اطلاعات مخاطب حقوقی" })
   @ApiResponse({ status: 200, description: "Company details" })
   @ApiResponse({ status: 404, description: "Company not found" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   getCompany(@Request() req: any, @Param("id") id: string) {
      return this.contactService.getCompany(req.user.id, +id);
   }
   //#endregion

   //#region Get All
   @Post("/getAll")
   @ApiOperation({ summary: "Get all Contact" })
   @ApiResponse({ status: 200, description: "List of Contacts" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   getAll(@Request() req: any, @Body() filter: FilterContactDto) {
      return this.contactService.getAll(req.user.id, filter);
   }
   //#endregion
}
