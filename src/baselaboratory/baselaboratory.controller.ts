import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BaselaboratoryService } from './baselaboratory.service';
import { CreateBaselaboratoryDto } from './dto/create-baselaboratory.dto';
import { UpdateBaselaboratoryDto } from './dto/update-baselaboratory.dto';


@Controller('baselaboratory')
export class BaselaboratoryController {

constructor(private readonly baselaboratoryService: BaselaboratoryService) { }

  
  @Post("add")
  create(@Body() createBaseLaboratoryDto: CreateBaselaboratoryDto) {
    return this.baselaboratoryService.create(createBaseLaboratoryDto);
  }

  
  @Get("getall")
  findAll() {
    return this.baselaboratoryService.findAll();
  }

 
  @Get("getfull")
  findAllPagSearch(
    @Query("page") page: string,
    @Query("limit") limit: string,
    @Query("search") search: string
  ) {
    return this.baselaboratoryService.findAllPagSearch(+page, +limit, search);
  }

 
  @Get('getby/:id')
  findOne(@Param('id') id: string) {
    return this.baselaboratoryService.findOne(+id);
  }

  
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateBaseLaboratoryDto: UpdateBaselaboratoryDto) {
    return this.baselaboratoryService.update(+id, updateBaseLaboratoryDto);
  }

  
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.baselaboratoryService.remove(+id);
  }
}
