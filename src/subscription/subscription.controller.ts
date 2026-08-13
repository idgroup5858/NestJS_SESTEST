import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) { }

  @UseGuards(AuthGuard("jwt"))
  @Post('add')
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(createSubscriptionDto);
  }

  // 2. Barcha obunalarni oddiy ro'yxat shaklida olish
  @UseGuards(AuthGuard("jwt"))
  @Get('getall')
  findAll() {
    return this.subscriptionService.getAll();
  }

  // 3. Mukammal paginatsiya va global qidiruv bilan obunalarni olish
  @UseGuards(AuthGuard("jwt"))
  @Get('getfull')
  findAllPagSearch(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search?: string,
  ) {
    // string ko'rinishida kelgan page va limitni "+" belgisi orqali number'ga o'tkazamiz
    return this.subscriptionService.findAllPagSearch(+page, +limit, search);
  }

  // 4. ID bo'yicha bitta obuna ma'lumotlarini olish
  @UseGuards(AuthGuard("jwt"))
  @Get('getby/:id')
  findOne(@Param('id') id: string) {
    // Agar serviceda findOne bo'lsa shuni chaqirasiz, hozircha metodni tekshirib oling
    return this.subscriptionService.findOne(+id);
  }

  // 5. Obuna ma'lumotlarini yangilash (Preload usulida)
  @UseGuards(AuthGuard("jwt"))
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionService.update(+id, updateSubscriptionDto);
  }

  // 6. Obunani o'chirish (Tezkor delete usulida)
  @UseGuards(AuthGuard("jwt"))
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.subscriptionService.delete(+id);
  }
}

