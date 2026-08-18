import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Analysis } from './entities/analysis.entity'; // Entity yo'lingizni tekshirib oling
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpdateAnalysisDto } from './dto/update-analysis.dto';
import { LaboratoryService } from 'src/laboratory/laboratory.service';
import { ClsService } from 'nestjs-cls';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Analysis)
    private readonly analysisRepository: Repository<Analysis>, // Bazaga ulanish

    private laboratoryService: LaboratoryService,
    private companyService: CompanyService,
    readonly cls: ClsService,

  ) { }

  // 1. Yangi tahlil (analysis) yaratish
  async create(createAnalysisDto: CreateAnalysisDto) {
    const cls_company_id = this.cls.get<number>('company_id');
    console.log("analysis create company_id");
    console.log(cls_company_id);

    const target_company_id = cls_company_id || createAnalysisDto.company_id;



    await this.laboratoryService.findOne(createAnalysisDto.laboratory_id,target_company_id)

    // const analysisCheck = await this.analysisRepository.findOne({
    //   where: { name: createAnalysisDto.name }
    // });
    // if (analysisCheck) {
    //   throw new ConflictException("Analysis already exist")
    // }

    const analysis = this.analysisRepository.create({
      ...createAnalysisDto,
      laboratory: { id: createAnalysisDto.laboratory_id }
    });

    if (target_company_id) {
      const company = await this.companyService.findOne(target_company_id)
      if (!company) throw new NotFoundException("Company not found");
      analysis.company = company
    }
    return await this.analysisRepository.save(analysis);
  }

  // 2. Barcha tahlillarni olish
  async findAll(company_id?:number) {
    const cls_company_id = this.cls.get<number>('company_id');
    console.log("analysis findall company_id");
    console.log(cls_company_id);

     const target_company_id = cls_company_id || company_id;


    return await this.analysisRepository.find({
      where: { company: { id: target_company_id } },
      relations: {
        laboratory: { lab_director: true }
      }
    });
  }

 

async findAllPagSearch(page: number, limit: number, search?: string, company_id?: number) {
  // 1. Qaysi company_id ustuvorligini aniqlaymiz (CLS birinchi o'rinda)
  const target_company_id = this.cls.get<number>('company_id') || company_id;

  // 2. Pagination qiymatlarini normallashtiramiz
  const validPage = page > 0 ? page : 1;
  const validLimit = limit > 0 ? limit : 10;
  const skip = (validPage - 1) * validLimit;

  // 3. QueryBuilder ni yaratamiz va asosiy WHERE poydevorini qo'yamiz
  const query = this.analysisRepository.createQueryBuilder('analysis')
    .leftJoinAndSelect('analysis.laboratory', 'laboratory')
    .where('1=1'); // Dinamik filtrlarni xavfsiz va chalkashliklarsiz ulash uchun

  // 4. Company ID bo'yicha filtr (CLS yoki controllerdan kelgan)
  if (target_company_id) {
    query.andWhere('analysis.company_id = :target_company_id', { target_company_id });
  }

  // 5. Brackets yordamida chuqurlashtirilgan qidiruv (Search)
  if (search) {
    query.andWhere(
      new Brackets((qb) => {
        qb.where('analysis.name ILIKE :search', { search: `%${search}%` })
          .orWhere('analysis.shortname ILIKE :search', { search: `%${search}%` })
          .orWhere('laboratory.name ILIKE :search', { search: `%${search}%` });
      }),
    );
  }

  // 6. Ma'lumotlarni bazadan olish
  const [data, total] = await query
    .orderBy('analysis.id', 'DESC')
    .skip(skip)
    .take(validLimit)
    .getManyAndCount();

  // 7. Standart pagination formatida qaytarish
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


  // 3. ID bo'yicha bitta tahlilni topish
  async findOne(id: number,company_id?:number) {

    const cls_company_id = this.cls.get<number>('company_id');
    console.log("analysis findone company_id");
    console.log(cls_company_id);

    const target_company_id = cls_company_id || company_id;

    const analysis = await this.analysisRepository.findOne({
      where: {
        id: id,
        company: { id: target_company_id }
      },
      relations: {
        laboratory: true,
        pattern: true
      }
    });
    if (!analysis) {
      throw new NotFoundException(`ID: ${id} bo'lgan tahlil topilmadi!`);
    }
    return analysis;
  }

  async findOneWithOutToken(id: number) {


    const analysis = await this.analysisRepository.findOne({
      where: {
        id: id
      },
      relations: {
        laboratory: true,
        pattern: true
      }
    });
    if (!analysis) {
      throw new NotFoundException(`ID: ${id} bo'lgan tahlil topilmadi!`);
    }
    return analysis;
  }

  // 4. Tahlil ma'lumotlarini yangilash
  async update(id: number, updateAnalysisDto: UpdateAnalysisDto) {
    await this.findOne(id,updateAnalysisDto.company_id)
    const analysis = await this.analysisRepository.preload({
      id,
      ...updateAnalysisDto,
    });
    if (!analysis) {
      throw new NotFoundException(`ID: ${id} bo'lgan tahlil topilmadi!`);
    }
    return await this.analysisRepository.save(analysis);
  }

  // 5. Tahlilni bazadan o'chirish va muvaffaqiyatli xabar qaytarish
  async remove(id: number,company_id?:number) {
    const analysis = await this.findOne(id,company_id); // Avval borligini tekshiramiz
    await this.analysisRepository.remove(analysis); // O'chiramiz

    return {
      success: true,
      message: 'Analysis deleted successfully',
      id: id,
    };
  }
}
