import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) { }

  @UseGuards(AuthGuard("jwt"))
  @Post("add")
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.create(createPlanDto);
  }
  @UseGuards(AuthGuard("jwt"))
  @Get("getall")
  findAll() {
    return this.planService.findAll();
  }
  @UseGuards(AuthGuard("jwt"))
  @Get('getby/:id')
  findOne(@Param('id') id: string) {
    return this.planService.findOne(+id);
  }
  @UseGuards(AuthGuard("jwt"))
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.update(+id, updatePlanDto);
  }
  @UseGuards(AuthGuard("jwt"))
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.planService.remove(+id);
  }
}
