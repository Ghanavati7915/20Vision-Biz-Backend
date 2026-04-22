import { Controller, UseGuards, Get, Request, Param, Body, Post, Put, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BaseService } from "./base.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Public } from "../auth/decorators/public.decorator";
import { CreateJobFieldTitleDto, CreateProductDto } from './dto/base.dto';
import { FilterDto } from '../common/DTOs/shared';
import { CreateDepartmentDto } from '../branch/dto/branch.dto';

@ApiTags("Base")
@ApiBearerAuth("JWT-auth")
@Controller("base")
@UseGuards(JwtAuthGuard)
export class BaseController {
   constructor(private readonly baseService: BaseService) { }

   //#region Create Product
   @Post("product")
   @ApiOperation({ summary: "Create a Product" })
   @ApiResponse({ status: 201, description: "Product created successfully" })
   @ApiResponse({ status: 400, description: "Bad request" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   createProduct(@Request() req: any, @Body() payload: CreateProductDto) {
      return this.baseService.createProduct(req.user.id, req.user.userID, payload);
   }
   //#endregion

   //#region Update Product
   @Put("/product/:id")
   @ApiOperation({ summary: "Update Product" })
   @ApiResponse({ status: 200, description: "Product Updated" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   updateProduct(@Request() req: any, @Param("id") id: string, @Body() payload: CreateProductDto) {
      return this.baseService.updateProduct(req.user.userID, payload, +id);
   }
   //#endregion

   //#region Get Products
   @Public()
   @Get("/products")
   @ApiOperation({ summary: "Get All Available Products" })
   @ApiResponse({ status: 200, description: "List of Products" })
   products() {
      return this.baseService.products();
   }
   //#endregion

   //#region Titles
   @Public()
   @Get("/titles")
   @ApiOperation({ summary: "Get All Available Titles" })
   @ApiResponse({ status: 200, description: "List of Titles" })
   titles() {
      return this.baseService.titles();
   }
   //#endregion

   //#region Company Search
   @Public()
   @Get("/company/search/:text")
   @ApiOperation({ summary: "Search In The Companies With NationalCode" })
   @ApiResponse({ status: 200, description: "List of Search Result" })
   companySearch(@Param("text") text: string) {
      return this.baseService.companySearch(text);
   }
   //#endregion

   //#region Cities
   @Get("/countries")
   @ApiOperation({ summary: "Get all Countries" })
   @ApiResponse({ status: 200, description: "List of Countries" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   countriesGetAll() {
      return this.baseService.countriesGetAll();
   }

   @Get("/provinces/:id")
   @ApiOperation({ summary: "Get all Provinces" })
   @ApiResponse({ status: 200, description: "List of Provinces" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   provincesGetAll(@Param("id") id: string) {
      return this.baseService.provincesGetAll(+id);
   }

   @Get("/cities/:id")
   @ApiOperation({ summary: "Get all Cities" })
   @ApiResponse({ status: 200, description: "List of Cities" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   citiesGetAll(@Param("id") id: string) {
      return this.baseService.citiesGetAll(+id);
   }

   @Public()
   @Get("/city")
   @ApiOperation({ summary: "Get all Cities From All Countries And All Provinces" })
   @ApiResponse({ status: 200, description: "List of All Cities" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   cityGetAll() {
      return this.baseService.cityGetAll();
   }
   //#endregion

  //#region JobFieldTitle
  //#region Create
  @Post('/JobFieldTitle')
  @ApiOperation({ summary: 'Create a new Job Field Titles' })
  @ApiResponse({ status: 201, description: 'job Field Titles created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create_jobFieldTitle(@Request() req: any, @Body() payload: CreateJobFieldTitleDto) {
    return this.baseService.create_jobFieldTitle(req.user.userID, payload);
  }
  //#endregion
  //#region Get
  @Get('/JobFieldTitle')
  @ApiOperation({ summary: 'Get all Job Field Titles' })
  @ApiResponse({ status: 200, description: 'List of Job Field Titles' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  get_jobFieldTitle() {
    return this.baseService.jobFieldTitleGetAll();
  }
  //#endregion
  //#region Update
  @Patch('/JobFieldTitle/:id')
  @ApiOperation({ summary: 'Update a Job Field Titles' })
  @ApiResponse({ status: 201, description: 'Job Field Titles updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update_jobFieldTitle(@Request() req: any, @Body() payload: CreateJobFieldTitleDto, @Param('id') id: string) {
    return this.baseService.update_jobFieldTitle(req.user.userID,+id,payload);
  }
  //#endregion
  //#region Delete
  @Get('/JobFieldTitle/:id')
  @ApiOperation({ summary: 'Delete a Job Field Titles' })
  @ApiResponse({ status: 201, description: 'Job Field Titles deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete_jobFieldTitle(@Request() req: any, @Param('id') id: string) {
    return this.baseService.delete_jobFieldTitle(req.user.userID,+id);
  }
  //#endregion
  //#endregion
}
