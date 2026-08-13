// plan.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  // 1. Yangi tarif plan yaratish
  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    

    const newPlan = this.planRepository.create(createPlanDto);
    return await this.planRepository.save(newPlan);
  }

 
  // async findAllActive(): Promise<Plan[]> {
  //   const plans = await this.planRepository.find({
  //     where: { isActive: true },
  //     order: { price: 'ASC' }, // Narxi bo'yicha o'sib borish tartibida
  //   });

  //   // PostgreSQL decimal tipini string qaytargani uchun uni number'ga o'giramiz
  //   return plans;
  // }

  // 3. Adminlar uchun barcha tariflarni olish (Faol bo'lmaganlarini ham)
  async findAll(): Promise<Plan[]> {
    const plans = await this.planRepository.find();
    return plans;
  }

  // 4. Bitta tarifni ID bo'yicha topish
  async findOne(id: number): Promise<Plan> {
    const plan = await this.planRepository.findOne({ 
      where: { id } 
    });
    
    if (!plan) {
      throw new NotFoundException(`IDsi ${id} bo'lgan tarif topilmadi.`);
    }

    
    return plan;
  }

  // 5. Tarif ma'lumotlarini yangilash
  async update(id: number, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    const plan = await this.findOne(id); // Borligini tekshirish
    
    // Yangi ma'lumotlarni birlashtirish
    const updatedPlan = Object.assign(plan, updatePlanDto);
    return await this.planRepository.save(updatedPlan);
  }

  // 6. Tarifni o'chirish (Soft delete / Deactivate)
  // SaaS loyihalarda tarifni butunlay o'chirish tavsiya etilmaydi, chunki eski kompaniyalar unga uylangan bo'lishi mumkin.
  // Shuning uchun uni shunchaki sotuvdan olib tashlaymiz (isActive: false)
   async remove(id: number) {
    const plan = await this.findOne(id);
    await this.planRepository.remove(plan);
    return { message: "Plan deleted" };
  }
}
