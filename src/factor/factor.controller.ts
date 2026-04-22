import { Controller, Body, UseGuards, Request, Post, Param, Put, Delete, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import FactorService from "./factor.service";
import {
  FactorDto, FactorPolicyDto, OrderDto,
} from './dto/factor.dto';
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { FilterDto } from '../common/DTOs/shared';

@ApiTags("Factor")
@ApiBearerAuth("JWT-auth")
@Controller("factor")
@UseGuards(JwtAuthGuard)
export class FactorController {
   constructor(private readonly factorService: FactorService) {}
  //#region Factor
    //#region Create Factor
   @Post()
   @ApiOperation({ summary: "Create a New Factor" })
   @ApiResponse({ status: 201, description: "Factor created successfully" })
   @ApiResponse({ status: 400, description: "Bad request" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   createFactor(@Request() req: any, @Body() payload: FactorDto) {
      return this.factorService.createFactor(req.user.id, req.user.userID, payload);
   }
   //#endregion
    //#region Update Factor
    @Put(":id")
    @ApiOperation({ summary: "Update a Factor" })
    @ApiResponse({ status: 201, description: "Factor updated successfully" })
    @ApiResponse({ status: 400, description: "Bad request" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    updateFactor(@Request() req: any, @Param("id") id: string, @Body() payload: FactorDto) {
      return this.factorService.updateFactor(req.user.id, req.user.userID, +id, payload);
    }
    //#endregion
    //#region Delete Factor
    @Delete(":id")
    @ApiOperation({ summary: "Delete a Factor" })
    @ApiResponse({ status: 201, description: "Factor Deleted successfully" })
    @ApiResponse({ status: 400, description: "Bad request" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    deleteFactor(@Request() req: any, @Param("id") id: string) {
      return this.factorService.deleteFactor(req.user.id, req.user.userID, +id);
    }
    //#endregion
    //#region Get All
    @Post("/getAll")
    @ApiOperation({ summary: "Get all Factors" })
    @ApiResponse({ status: 200, description: "List of Factors" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    getAll(@Request() req: any,@Body() filter: FilterDto) {
      return this.factorService.getAll(req.user.id, filter);
    }
    //#endregion
    //#region Get By ID
    @Get(":id")
    @ApiOperation({ summary: "Get a Factor" })
    @ApiResponse({ status: 201, description: "Factor successfully" })
    @ApiResponse({ status: 400, description: "Bad request" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    getFactor(@Request() req: any, @Param("id") id: string) {
      return this.factorService.getFactor(req.user.id, +id);
    }
    //#endregion
  //#region Get By Order ID
  @Get("byOrderID/:orderId")
  @ApiOperation({ summary: "Get a Factor By Order ID" })
  @ApiResponse({ status: 201, description: "Factor By Order ID successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  getFactorByOrderID(@Request() req: any, @Param("orderId") orderId: string) {
    return this.factorService.getFactorByOrderID(req.user.id, +orderId);
  }
  //#endregion
  //#endregion

  //#region Factor Policies
  //#region Create Factor Policy
  @Post('policy')
  @ApiOperation({ summary: "Create a New Factor Policy" })
  @ApiResponse({ status: 201, description: "Factor Policy created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  createFactorPolicy(@Request() req: any, @Body() payload: FactorPolicyDto) {
    return this.factorService.createFactorPolicy(req.user.userID, payload);
  }
  //#endregion
  //#region Update Factor Policy
  @Put("policy/:id")
  @ApiOperation({ summary: "Update a Factor Policy" })
  @ApiResponse({ status: 201, description: "Factor Policy updated successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  updateFactorPolicy(@Request() req: any, @Param("id") id: string, @Body() payload: FactorPolicyDto) {
    return this.factorService.updateFactorPolicy(req.user.userID, +id, payload);
  }
  //#endregion
  //#region Delete Factor Policy
  @Delete("policy/:id")
  @ApiOperation({ summary: "Delete a Factor Policies" })
  @ApiResponse({ status: 201, description: "Factor Policies Deleted successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  deletePolicyFactor(@Request() req: any, @Param("id") id: string) {
    return this.factorService.deletePolicyFactor( req.user.userID, +id);
  }
  //#endregion
  //#region Get All Factor Policy
  @Post("policy/getAll")
  @ApiOperation({ summary: "Get all Factor Policies" })
  @ApiResponse({ status: 200, description: "List of Factor Policies" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  getAllPolicies(@Body() filter: FilterDto) {
    return this.factorService.getAllPolicies(filter);
  }
  //#endregion
  //#endregion

  //#region Order
  //#region Create Order
  @Post('order')
  @ApiOperation({ summary: "Create a New Order" })
  @ApiResponse({ status: 201, description: "Order created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  createOrder(@Request() req: any, @Body() payload: OrderDto) {
    return this.factorService.createOrder(req.user.userID, payload);
  }
  //#endregion
  //#region Update Order
  @Put("order/:id")
  @ApiOperation({ summary: "Update a Order" })
  @ApiResponse({ status: 201, description: "Order updated successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  updateOrder(@Request() req: any, @Param("id") id: string, @Body() payload: OrderDto) {
    return this.factorService.updateOrder(req.user.userID, req.user.nationalCode, +id, payload);
  }
  //#endregion
  //#region Delete Order
  @Delete("order/:id")
  @ApiOperation({ summary: "Delete a Order" })
  @ApiResponse({ status: 201, description: "Order Deleted successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  deleteOrder(@Request() req: any, @Param("id") id: string) {
    return this.factorService.deleteOrder(req.user.nationalCode, req.user.userID, +id);
  }
  //#endregion
  //#region Get All
  @Post("order/getAll")
  @ApiOperation({ summary: "Get all Orders" })
  @ApiResponse({ status: 200, description: "List of Orders" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  getAllOrders(@Request() req: any,@Body() filter: FilterDto) {
    return this.factorService.getAllOrders(req.user.id,req.user.nationalCode, filter);
  }
  //#endregion
  //#region Get By ID
  @Get("order/:id")
  @ApiOperation({ summary: "Get a Order" })
  @ApiResponse({ status: 201, description: "Order successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  getOrder(@Request() req: any, @Param("id") id: string) {
    return this.factorService.getOrder(req.user.nationalCode, +id);
  }
  //#endregion
  //#endregion

}
