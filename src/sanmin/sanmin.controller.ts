import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SanminService } from './sanmin.service';
import { CreateSanminDto } from './dto/create-sanmin.dto';
import { UpdateSanminDto } from './dto/update-sanmin.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('sanmin')
export class SanminController {
  constructor(private readonly sanminService: SanminService) { }

  @UseGuards(AuthGuard("jwt"))
  @Post("add")
  create(@Body() createSanminDto: CreateSanminDto) {
    return this.sanminService.create(createSanminDto);
  }


  @UseGuards(AuthGuard("jwt"))
  @Get("getall")
  findAll() {
    return this.sanminService.findAll();
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("getfull")
  findAllPagSearch(
    @Query("page") page: string,
    @Query("limit") limit: string,
    @Query("search") search: string
  ) {
    return this.sanminService.findAllPagSearch(+page, +limit, search);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("totalamountrange")
  findSanminTotalAmountRange(
    @Query('search') search?: string,
    @Query('payment_method') payment_method?: string,
    @Query('payment_status') payment_status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.sanminService.findSanminTotalAmountRange(
      search,
      payment_method,
      payment_status,
      startDate,
      endDate,
    );
  }


  @UseGuards(AuthGuard("jwt"))
  @Get('getby/:id')
  findOne(@Param('id') id: string) {
    return this.sanminService.findOne(+id);
  }
  @UseGuards(AuthGuard("jwt"))
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateSanminDto: UpdateSanminDto) {
    return this.sanminService.update(+id, updateSanminDto);
  }
  @UseGuards(AuthGuard("jwt"))
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.sanminService.remove(+id);
  }
}
