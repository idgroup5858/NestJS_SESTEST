// subscription.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';

import { CompanyService } from 'src/company/company.service';
import { PlanService } from 'src/plan/plan.service';
import { Subscription } from './entities/subscription.entity';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subRepository: Repository<Subscription>,
    private readonly companyService:CompanyService,
    private readonly planService:PlanService
  ) {}

  // 1. Yangi obuna yaratish yoki mavjudini yangilash (Tarif sotib olinganda)
    async createSubscription(dto: CreateSubscriptionDto): Promise<Subscription> {
    const { company_id, plan_id, ...rest } = dto;

    // 1. Avval bog'liqliklarni bazadan tekshirib olamiz (yoki xizmat o'zi xato otadi)
    const company = await this.companyService.findOne(company_id);
    const plan = await this.planService.findOne(plan_id);

    // 2. Yangi obuna obyektini yaratamiz va bog'liqliklarni yuklaymiz
    const subscription = this.subRepository.create({
      ...rest,
      company,
      plan,
    });

    // 3. Bazaga saqlaymiz
    return await this.subRepository.save(subscription);
  }


  // 2. Kompaniyaning hozirgi obuna holatini olish
  async getAll(): Promise<Subscription[]> {
    const subscription = await this.subRepository.find({
     relations: {plan:true,company:true} 
    });

    if (!subscription) {
      throw new NotFoundException('Ushbu kompaniyada hech qanday obuna topilmadi.');
    }

    return subscription;
  }

   async findOne(id:number): Promise<Subscription> {
    const subscription = await this.subRepository.findOne({
      where:{id},
     relations: {plan:true,company:true} 
    });

    if (!subscription) {
      throw new NotFoundException('Ushbu kompaniyada hech qanday obuna topilmadi.');
    }

    return subscription;
  }


    async findAllPagSearch(page: number, limit: number, search?: string) {
   

    // Sahifalash parametrlarini xavfsiz holatga keltiramiz
    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;
    const skip = (page - 1) * limit;

    // QueryBuilder yaratamiz va plan hamda company munosabatlarini bog'laymiz
    const query = this.subRepository.createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.plan', 'plan')
      .leftJoinAndSelect('subscription.company', 'company');

    

    // 2. Agar qidiruv so'zi bo'lsa, plan nomi yoki kompaniya nomi bo'yicha qidiramiz
    if (search) {
      // Yangi qavs ichidagi shartni andWhere orqali zanjirga ulaymiz
      query.where(
        '(plan.name ILIKE :search OR company.name ILIKE :search)', 
        { search: `%${search}%` }
      );
    }

    // Ma'lumotlarni tartiblaymiz va umumiy soni bilan birga yuklab olamiz
    const [data, total] = await query
      .orderBy('subscription.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // Natijani qaytaramiz
    return {
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data,
    };
  }



    // 3. Obunani yangilash (Update - Preload orqali)
  async update(id: number, dto: UpdateSubscriptionDto): Promise<Subscription> {
    const { company_id, plan_id, ...rest } = dto;

    // preload bazadan obunani qidiradi va rest ma'lumotlarini unga yuklaydi
    const subscription = await this.subRepository.preload({
      id,
      ...rest,
    });

    // Agar obuna bazada topilmasa, preload undefined qaytaradi
    if (!subscription) {
      throw new NotFoundException(`IDsi ${id} bo'lgan obuna topilmadi.`);
    }

    // Kompaniya o'zgargan bo'lsa, tekshirib qayta bog'laymiz
    if (company_id) {
      const company = await this.companyService.findOne(company_id);
      subscription.company = company;
    }

    // Plan o'zgargan bo'lsa, tekshirib qayta bog'laymiz
    if (plan_id) {
      const plan = await this.planService.findOne(plan_id);
      subscription.plan = plan;
    }

    return await this.subRepository.save(subscription);
  }




    // 4. Obunani o'chirish (Delete)
  async delete(id: number): Promise<{ message: string }> {
    // delete() bazadan obyektni yuklamasdan to'g'ridan-to'g'ri SQL so'rovi yuboradi
    const result = await this.subRepository.delete(id);

    // affected: 0 bo'lsa, demak bunday IDli qator bazada bo'lmagan
    if (result.affected === 0) {
      throw new NotFoundException(`IDsi ${id} bo'lgan obuna topilmadi.`);
    }

    return { message: `IDsi ${id} bo'lgan obuna muvaffaqiyatli o'chirildi.` };
  }



   

}
