import { Controller, Body, UseGuards, Param, Get, Request, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { MonitoringService } from "./monitoring.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Public } from "../auth/decorators/public.decorator";
import { MonitorDto } from "./dto/monitoring.dto";

@ApiTags("Monitoring")
@ApiBearerAuth("JWT-auth")
@Controller("monitoring")
@UseGuards(JwtAuthGuard)
export class MonitoringController {
   constructor(private readonly monitoringService: MonitoringService) {}

   //#region Get Monitor
   @Public()
   @Get(":id")
   @ApiOperation({ summary: "Get Monitor By ID" })
   @ApiResponse({ status: 200, description: "Monitor Data" })
   @ApiResponse({ status: 404, description: "Monitor not found" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   getByID(@Param("id") id: number) {
      return this.monitoringService.getByID(id);
   }
   //#endregion

   //#region My Monitor
   @Get()
   @ApiOperation({ summary: "Get My Monitor" })
   @ApiResponse({ status: 200, description: "My Monitor Data" })
   @ApiResponse({ status: 404, description: "My Monitor not found" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   getMyMonitor(@Request() req: any) {
      return this.monitoringService.getMyMonitor(req.user.id);
   }
   //#endregion

   //#region Edit Monitor
   @Post()
   @ApiOperation({ summary: "Update Monitor" })
   @ApiResponse({ status: 201, description: "Monitor Created/Updated successfully" })
   @ApiResponse({ status: 400, description: "Bad request" })
   @ApiResponse({ status: 401, description: "Unauthorized" })
   updateMonitor(@Request() req: any, @Body() payload: MonitorDto) {
      return this.monitoringService.updateMonitor(req.user.id, payload);
   }
   //#endregion
}
