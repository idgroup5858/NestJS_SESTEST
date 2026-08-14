import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RegionService } from './region.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  

   @UseGuards(AuthGuard("jwt"))
   @Patch('update/regionuser')
  async updateRegionUser(
   
    @Body() body: {region_id:number, user_id: number } 
  ) {
    return await this.regionService.update(body.region_id, body.user_id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch('delete/regionuser')
  async removeRegionUser(
    // Body orqali faqat qaysi regiondan user o'chirilishi kerakligini (id) olamiz
    @Body() body: { region_id: number }
  ) {
    return await this.regionService.removeUserFromRegion(body.region_id);
  }

  @Get("getallregion")
  findAll() {
    return this.regionService.findAll();
  }

  @Get("getalldistrict")
  findAlDistrict() {
    return this.regionService.findAllDistrict();
  }

  @Get('getby/region/:id')
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(+id);
  }

  @Get('getby/district/:id')
  findOneDistrict(@Param('id') id: string) {
    return this.regionService.findOneDistrict(+id);
  }

  
}
