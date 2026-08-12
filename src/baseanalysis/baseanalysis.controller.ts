import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BaseanalysisService } from './baseanalysis.service';
import { CreateBaseanalysisDto } from './dto/create-baseanalysis.dto';
import { UpdateBaseanalysisDto } from './dto/update-baseanalysis.dto';

@Controller('baseanalysis')
export class BaseanalysisController {
  constructor(private readonly baseanalysisService: BaseanalysisService) { }

  // 1. Yangi tahlil qo'shish

  @Post("add")
  create(@Body() createBaseAnalysisDto: CreateBaseanalysisDto) {
    return this.baseanalysisService.create(createBaseAnalysisDto);
  }

  // 2. Barcha tahlillarni oddiy ro'yxat shaklida olish

  @Get("getall")
  findAll() {
    return this.baseanalysisService.findAll();
  }


  @Get("getfull")
  findAllPagSearch(
    @Query("page") page: string,
    @Query("limit") limit: string,
    @Query("search") search: string
  ) {
    return this.baseanalysisService.findAllPagSearch(+page, +limit, search);
  }


  @Get('getby/:id')
  findOne(@Param('id') id: string) {
    return this.baseanalysisService.findOne(+id);
  }

  // 5. Tahlilni yangilash

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateBaseAnalysisDto: UpdateBaseanalysisDto) {
    return this.baseanalysisService.update(+id, updateBaseAnalysisDto);
  }

  // 6. Tahlilni o'chirish

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.baseanalysisService.remove(+id);
  }
}
