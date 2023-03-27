import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GatewaysService } from './gateways.service';
import { CreateGatewayDto, GatewayFiltersDto } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';

@Controller('gateways')
export class GatewaysController {
  constructor(private readonly gatewaysService: GatewaysService) {}

  @Post()
  create(@Body() createGatewayDto: CreateGatewayDto) {
    return this.gatewaysService.create(createGatewayDto);
  }

  @Get()
  findAll(@Query() filters: GatewayFiltersDto) {
    return this.gatewaysService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gatewaysService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGatewayDto: UpdateGatewayDto) {
    return this.gatewaysService.update(id, updateGatewayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gatewaysService.remove(id);
  }
}
