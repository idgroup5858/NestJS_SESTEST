import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Onlinestorage } from './entities/onlinestorage.entity'; // Entity manzili
import { CreateOnlinestorageDto } from './dto/create-onlinestorage.dto';
import { UpdateOnlinestorageDto } from './dto/update-onlinestorage.dto';
import { AnalysisService } from 'src/analysis/analysis.service';
import { ClsService } from 'nestjs-cls';
import { CompanyService } from 'src/company/company.service';
// Bog'langan servis (agar bo'lsa)

@Injectable()
export class OnlinestorageService {
  constructor(
    @InjectRepository(Onlinestorage)
    private readonly onlinestorageRepository: Repository<Onlinestorage>,

    private analysisServie: AnalysisService,
    private readonly cls: ClsService,
    private companyService: CompanyService,
  ) { }

  // 1. Onlinestorage yaratish (Relation ob'ekt bilan)
  async create(createOnlinestorageDto: CreateOnlinestorageDto) {
    const cls_company_id = this.cls.get<number>('company_id');
    console.log("storage create company_id");
    console.log(cls_company_id);

    const target_company_id = cls_company_id || createOnlinestorageDto.company_id;

    const { analysis_id, company_id, ...rest } = createOnlinestorageDto



    const onlinestorage = this.onlinestorageRepository.create({
      ...rest
    });

    if (analysis_id) {
      const analysis = await this.analysisServie.findOne(createOnlinestorageDto.analysis_id)
      if (!analysis) throw new NotFoundException("Analysis not found");
      onlinestorage.analysis = analysis
    }
    if (createOnlinestorageDto.company_id) {
      const company = await this.companyService.findOne(createOnlinestorageDto.company_id)
      if (!company) throw new NotFoundException("Company not found");
      onlinestorage.company = company;
    }else if (cls_company_id) {
      const company = await this.companyService.findOne(cls_company_id)
      if (!company) throw new NotFoundException("Company not found");
      onlinestorage.company = company;
    }

    return await this.onlinestorageRepository.save(onlinestorage);
  }

  // 2. Barcha Onlinestorage'larni ob'ekti bilan birga yuklash
  async findAll(company_id?:number) {
    const cls_company_id = this.cls.get<number>('company_id');
    console.log("storage findall company_id");
    console.log(cls_company_id);

     const target_company_id = cls_company_id || company_id;

    return await this.onlinestorageRepository.find({
      where: { company: { id: target_company_id } },
      relations: {
        analysis: true
      },
    });
  }

 async findAllPagSearch(page: number, limit: number, search?: string, company_id?: number) {
  // 1. Qaysi company_id ustuvorligini aniqlaymiz (CLS birinchi o'rinda)
  const target_company_id = this.cls.get<number>('company_id') || company_id;

  // 2. Pagination qiymatlarini normallashtiramiz
  const validPage = page > 0 ? page : 1;
  const validLimit = limit > 0 ? limit : 10;
  const skip = (validPage - 1) * validLimit;

  // 3. QueryBuilder ni yaratamiz va poydevor qo'yamiz
  const query = this.onlinestorageRepository.createQueryBuilder('onlinestorage')
    .leftJoinAndSelect('onlinestorage.analysis', 'analysis')
    .where('1=1'); // Dinamik shartlar xavfsiz bog'lanishi uchun

  // 4. Kompaniya ID bo'yicha filtr
  if (target_company_id) {
    query.andWhere('onlinestorage.company_id = :target_company_id', { target_company_id });
  }

  // 5. Brackets'siz, qavslar ichidagi qidiruv (Search)
  if (search) {
    query.andWhere(
      '(onlinestorage.name ILIKE :search OR analysis.name ILIKE :search)',
      { search: `%${search}%` }
    );
  }

  // 6. Ma'lumotlarni bazadan olish
  const [data, total] = await query
    .orderBy('onlinestorage.createdAt', 'DESC')
    .skip(skip)
    .take(validLimit)
    .getManyAndCount();

  // 7. Standart pagination formati
  return {
    meta: {
      total,
      page: validPage,
      limit: validLimit,
      totalPages: Math.ceil(total / validLimit),
    },
    data,
  };
}


  // 3. ID bo'yicha olish (Ob'ekti bilan birga)
  async findOne(id: number,company_id?:number): Promise<Onlinestorage> {
    const cls_company_id = this.cls.get<number>('company_id');
    console.log("storage findone company_id");
    console.log(cls_company_id);

    const target_company_id = cls_company_id || company_id;
    const onlinestorage = await this.onlinestorageRepository.findOne({
      where: { id, company: { id: target_company_id } },
      relations: {
        // foreignEntity: true // Bog'langan ob'ektni qo'shib yuklaydi
      },
    });

    if (!onlinestorage) {
      throw new NotFoundException(`IDsi ${id} bo'lgan onlinestorage topilmadi.`);
    }
    return onlinestorage;
  }

  async findOneWithOutToken(id: number): Promise<Onlinestorage> {
    
    const onlinestorage = await this.onlinestorageRepository.findOne({
      where: { id },
      relations: {
        // foreignEntity: true // Bog'langan ob'ektni qo'shib yuklaydi
      },
    });

    if (!onlinestorage) {
      throw new NotFoundException(`IDsi ${id} bo'lgan onlinestorage topilmadi.`);
    }
    return onlinestorage;
  }

  // 4. Onlinestorage'ni yangilash (Relation ob'ekt bilan)
  async update(id: number, updateOnlinestorageDto: UpdateOnlinestorageDto) {
    // Avval ushbu IDli ma'lumot borligini tekshiramiz
    await this.findOne(id,updateOnlinestorageDto.company_id);

    // DTO ichidan foreign_id va qolgan ma'lumotlarni ajratib olamiz
    const { analysis_id, ...storageData } = updateOnlinestorageDto

    // preload() mavjud ma'lumotni yangi qiymatlar bilan qisman yangilaydi
    const onlinestorage = await this.onlinestorageRepository.preload({
      id: id,
      ...storageData,
    });

    if (!onlinestorage) {
      throw new NotFoundException(`IDsi ${id} bo'lgan onlinestorage topilmadi.`);
    }

    if (analysis_id) {
      const analysis = await this.analysisServie.findOne(analysis_id);
      onlinestorage.analysis = analysis;
    }



    return await this.onlinestorageRepository.save(onlinestorage);
  }

  // 5. Onlinestorage'ni o'chirish
  async remove(id: number,company_id?:number): Promise<void> {
    const onlinestorage = await this.findOne(id,company_id);
    await this.onlinestorageRepository.remove(onlinestorage);
  }
}
