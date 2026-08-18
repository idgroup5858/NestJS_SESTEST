import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Laboratory } from './entities/laboratory.entity';
import { CreateLaboratoryDto } from './dto/create-laboratory.dto';
import { UpdateLaboratoryDto } from './dto/update-laboratory.dto';
import { UserService } from 'src/user/user.service';
import { CompanyService } from 'src/company/company.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class LaboratoryService {
  constructor(
    @InjectRepository(Laboratory)
    private readonly laboratoryRepository: Repository<Laboratory>,

    private userService: UserService,

    private companyService: CompanyService,

    readonly cls: ClsService,
  ) { }


  async create(createLaboratoryDto: CreateLaboratoryDto) {
    const cls_company_id = this.cls.get<number>('company_id');
    console.log("laboratory create company_id");
    console.log(cls_company_id);

    const target_company_id = cls_company_id || createLaboratoryDto.company_id;

    const { lab_director_id, company_id, ...rest } = createLaboratoryDto;

    const laboratory = this.laboratoryRepository.create({
      ...rest
    });

    if (createLaboratoryDto.lab_director_id) {
      const user = await this.userService.findOne(createLaboratoryDto.lab_director_id);
      laboratory.lab_director = user
    }

    if (target_company_id) {
      const company = await this.companyService.findOne(target_company_id);
      if (!company) throw new NotFoundException("Company not found");
      laboratory.company = company;
    }
    return await this.laboratoryRepository.save(laboratory);
  }

  async findAll(company_id?:number) {
    const cls_company_id = this.cls.get<number>('company_id');
    const target_company_id = cls_company_id || company_id;
    console.log("laboratory findall company_id");
    console.log(cls_company_id);
    return await this.laboratoryRepository.find({
      where: { company: { id: target_company_id } },
      relations: {
        analysis: true,
        lab_director: true,
        lab_assistants: true
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
    const query = this.laboratoryRepository.createQueryBuilder('laboratory')
      .leftJoinAndSelect('laboratory.analysis', 'analysis')
      .leftJoinAndSelect('laboratory.lab_director', 'lab_director')
      .leftJoinAndSelect('laboratory.lab_assistants', 'lab_assistants')
      .where('1=1'); // Barcha keyingi if shartlari andWhere bilan xavfsiz bog'lanishi uchun

    // 4. Dinamik filtrlarni faqat andWhere bilan qo'shamiz
    if (search) {
      query.andWhere('laboratory.name ILIKE :search', { search: `%${search}%` });
    }

    if (target_company_id) {
      query.andWhere('laboratory.company_id = :target_company_id', { target_company_id });
    }

    // 5. Ma'lumotlarni bazadan olamiz
    const [data, total] = await query
      .orderBy('laboratory.id', 'DESC')
      .skip(skip)
      .take(validLimit)
      .getManyAndCount();

    // 6. Standart pagination formatida qaytaramiz
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


  // 3. ID bo'yicha bitta laboratoriyani topish
  async findOne(id: number,company_id?:number) {

    const cls_company_id = this.cls.get<number>('company_id');
     const target_company_id = cls_company_id || company_id;
    console.log("laboratory findOne company_id");
    console.log(cls_company_id);


    const laboratory = await this.laboratoryRepository.findOne({
      where: {
        id: id,
        company: { id: target_company_id }
      },
      relations: {
        analysis: true,
        lab_director: true,
        lab_assistants: true
      }
    });


    if (!laboratory) {
      throw new NotFoundException(`ID: ${id} bo'lgan laboratoriya topilmadi!`);
    }
    return laboratory;
  }




  async update(id: number, updateLaboratoryDto: UpdateLaboratoryDto) {

    const laboratoryCheck = await this.findOne(id,updateLaboratoryDto.company_id);

    const { lab_director_id, ...rest } = updateLaboratoryDto;

    const laboratory = await this.laboratoryRepository.preload({
      id, ...rest
    });

    if (!laboratory) {
      throw new NotFoundException(`ID: ${id} bo'lgan laboratoriya topilmadi!`);
    }

    if (lab_director_id !== undefined) {
      const lab = await this.userService.findOne(lab_director_id);
      laboratory.lab_director = lab
    }

    return this.laboratoryRepository.save(laboratory);
  }

  // async update(id: number, updateLaboratoryDto: UpdateLaboratoryDto) {
  //     const { lab_director_id, ...rest } = updateLaboratoryDto;

  //     const laboratory = await this.laboratoryRepository.preload({ id, ...rest });

  //     if (!laboratory) {
  //       throw new NotFoundException(`ID: ${id} bo'lgan laboratoriya topilmadi!`);
  //     }

  //     if (lab_director_id !== undefined) {
  //       laboratory.lab_director = lab_director_id
  //         ? await this.userService.findOne(lab_director_id)
  //         : null;
  //     }

  //     return this.laboratoryRepository.save(laboratory);
  //   }


  async remove(id: number,company_id?:number) {
    const laboratory = await this.findOne(id,company_id);
    await this.laboratoryRepository.remove(laboratory);


    return {
      success: true,
      message: 'Laboratory deleted successfully',
      id: id,
    };
  }


  async addAssistant(laboratory_id: number, userId: number) {

    const company_id = this.cls.get<number>('company_id');
    console.log("laboratory addAssistant company_id");
    console.log(company_id);

    const laboratory = await this.laboratoryRepository.findOne({
      where: {
        id: laboratory_id,
        company: { id: company_id }
      },
      relations: { lab_assistants: true },
    });

    if (!laboratory) throw new NotFoundException('Laboratoriya topilmadi');

    const user = await this.userService.findOne(userId);

    const alreadyExists = laboratory.lab_assistants.find((a) => a.id === userId);

    if (alreadyExists) {
      throw new ConflictException('Bu foydalanuvchi allaqachon assistant');
    }

    laboratory.lab_assistants.push(user);
    return this.laboratoryRepository.save(laboratory);
  }

  async removeAssistant(laboratory_id: number, userId: number) {
    const company_id = this.cls.get<number>('company_id');
    console.log("laboratory removeAssistant company_id");
    console.log(company_id);

    const laboratory = await this.laboratoryRepository.findOne({
      where: {
        id: laboratory_id,
        company: { id: company_id }
      },
      relations: { lab_assistants: true },
    });

    if (!laboratory) throw new NotFoundException('Laboratoriya topilmadi');

    const assistant = laboratory.lab_assistants.find((a) => a.id === userId);

    if (!assistant) {
      throw new NotFoundException('Bu foydalanuvchi laboratoriya assistanti emas');
    }

    laboratory.lab_assistants = laboratory.lab_assistants.filter(
      (a) => a.id !== userId,
    );

    return this.laboratoryRepository.save(laboratory);
  }



}
