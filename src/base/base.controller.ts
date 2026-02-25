import { Controller, UseGuards, Get, Request, Param, Body, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BaseService } from "./base.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Public } from "../auth/decorators/public.decorator";
import { CreateProductDto } from "./dto/base.dto";

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
}
