import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { DealService } from './deal.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('deal')
export class DealController {
  constructor(private readonly dealService: DealService) { }

  @UseGuards(AuthGuard("jwt"))
  @Post("add")
  create(@Body() createDealDto: CreateDealDto) {
    return this.dealService.create(createDealDto);
  }


  @UseGuards(AuthGuard("jwt"))
  @Get("getall")
  findAll() {
    return this.dealService.findAll();
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("getfull")
  findAllPagSearch(
    @Query("page") page: string,
    @Query("limit") limit: string,
    @Query("search") search: string
  ) {
    return this.dealService.findAllPagSearch(+page, +limit, search);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("totalamountrange")
  findDealTotalAmountRange(
    @Query('search') search?: string,
    @Query('payment_method') payment_method?: string,
    @Query('payment_status') payment_status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dealService.findDealTotalAmountRange(
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
    return this.dealService.findOne(+id);
  }
  @UseGuards(AuthGuard("jwt"))
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateDealDto: UpdateDealDto) {
    return this.dealService.update(+id, updateDealDto);
  }
  @UseGuards(AuthGuard("jwt"))
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.dealService.remove(+id);
  }
}
