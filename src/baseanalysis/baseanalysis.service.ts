import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBaseanalysisDto } from './dto/create-baseanalysis.dto';
import { UpdateBaseanalysisDto } from './dto/update-baseanalysis.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Baseanalysis } from './entities/baseanalysis.entity';
import { Brackets, Repository } from 'typeorm';
import { BaselaboratoryService } from 'src/baselaboratory/baselaboratory.service';

@Injectable()
export class BaseanalysisService {
  constructor(
     @InjectRepository(Baseanalysis)
     private readonly baseanalysisRepository: Repository<Baseanalysis>, // Bazaga ulanish
 
     private baselaboratoryService: BaselaboratoryService,
    
 
   ) { }
 
   // 1. Yangi tahlil (analysis) yaratish
   async create(createbaseAnalysisDto: CreateBaseanalysisDto) {
   
 
 
     await this.baselaboratoryService.findOne(createbaseAnalysisDto.baselaboratory_id)
 
     
     const analysis = this.baseanalysisRepository.create({
       ...createbaseAnalysisDto,
       baselaboratory: { id: createbaseAnalysisDto.baselaboratory_id }
     });
 
   
     return await this.baseanalysisRepository.save(analysis);
   }
 
   // 2. Barcha tahlillarni olish
   async findAll() {
     
 
     return await this.baseanalysisRepository.find({
       
       relations: {
         baselaboratory:true
       }
     });
   }
 
   async findAllPagSearch(page: number, limit: number, search?: string) {
 
 
    
 
     page = page > 0 ? page : 1;
     limit = limit > 0 ? limit : 10;
 
     const skip = (page - 1) * limit;
 
     const query = this.baseanalysisRepository.createQueryBuilder('baseanalysis')
       .leftJoinAndSelect('baseanalysis.baselaboratory', 'baselaboratory')
     // .leftJoinAndSelect('user.classs', 'classs')
     // .leftJoinAndSelect('sale.items', 'items')
     // .leftJoinAndSelect('sale.payments', 'payments')
     // .leftJoinAndSelect('sale.user', 'user')
     // .leftJoinAndSelect('items.warehouse', 'warehouse')
     // .leftJoinAndSelect('items.product', 'product')
     // .leftJoinAndSelect('sale.customer', 'customer');
 
     
 
 
     if (search) {
       query.where(
         new Brackets((qb) => {
           qb.where('baseanalysis.name ILIKE :search', { search: `%${search}%` })
             .orWhere('baseanalysis.shortname ILIKE :search', { search: `%${search}%` })
             .orWhere('baselaboratory.name ILIKE :search', { search: `%${search}%` });
         }),
       );
     }
     // if (search) {
     //   query.andWhere(
     //     '(analysis.name ILIKE :search OR analysis.shortname ILIKE :search OR laboratory.name ILIKE :search)',  //LIKE MYSQL ILIKE POSTGRESQL
     //     { search: `%${search}%` }
     //   );
     // }
 
 
 
     const [data, total] = await query
       .orderBy('baseanalysis.id', 'DESC')
       .skip(skip)
       .take(limit)
       .getManyAndCount();
 
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
 
   // 3. ID bo'yicha bitta tahlilni topish
   async findOne(id: number) {
 
  
 
     const analysis = await this.baseanalysisRepository.findOne({
       where: {
         id: id
       },
       relations: {
         baselaboratory: true
       }
     });
     if (!analysis) {
       throw new NotFoundException(`ID: ${id} bo'lgan tahlil topilmadi!`);
     }
     return analysis;
   }
 
   
 
   // 4. Tahlil ma'lumotlarini yangilash
   async update(id: number, updateBaseAnalysisDto: UpdateBaseanalysisDto) {
     await this.findOne(id)
     const analysis = await this.baseanalysisRepository.preload({
       id,
       ...updateBaseAnalysisDto,
     });
     if (!analysis) {
       throw new NotFoundException(`ID: ${id} bo'lgan BaseAnalysis topilmadi!`);
     }
     return await this.baseanalysisRepository.save(analysis);
   }
 
   // 5. Tahlilni bazadan o'chirish va muvaffaqiyatli xabar qaytarish
   async remove(id: number) {
     const analysis = await this.findOne(id); // Avval borligini tekshiramiz
     await this.baseanalysisRepository.remove(analysis); // O'chiramiz
 
     return {
       success: true,
       message: 'BaseAnalysis deleted successfully',
       id: id,
     };
   }
}
