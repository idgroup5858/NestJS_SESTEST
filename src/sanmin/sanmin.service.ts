import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSanminDto } from './dto/create-sanmin.dto';
import { UpdateSanminDto } from './dto/update-sanmin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sanmin } from './entities/sanmin.entity';
import { Brackets, Repository } from 'typeorm';
import { CompanyService } from 'src/company/company.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class SanminService {

  constructor(
    @InjectRepository(Sanmin)
    private readonly sanminRepository: Repository<Sanmin>,
    private companyService: CompanyService,
    readonly cls: ClsService,
  ) { }



  async create(createSanminDto: CreateSanminDto) {
    const company_id = this.cls.get<number>('company_id');
    console.log("sanmin  create company_id");
    console.log(company_id);

    const sanmin = this.sanminRepository.create({
      ...createSanminDto
    });

    if (company_id) {
      const company = await this.companyService.findOne(company_id)
      if (!company) throw new NotFoundException("Company not found");
      sanmin.company = company
    }
    return await this.sanminRepository.save(sanmin);
  }

  async findAll() {
    const company_id = this.cls.get<number>('company_id');
    console.log("sanmin  findall company_id");
    console.log(company_id);

    return await this.sanminRepository.find({
      where: { company: { id: company_id } },
      relations: {
        company: true
      }
    });
  }

    async findAllPagSearch(page: number, limit: number, search?: string) {
    const company_id = this.cls.get<number>('company_id');

    // Xavfsizlik: company_id bo'lmasa, hamma ma'lumot chiqib ketmasin
    if (!company_id) {
      throw new ForbiddenException('Company aniqlanmadi');
    }

    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;
    const skip = (page - 1) * limit;

    const query = this.sanminRepository
      .createQueryBuilder('sanmin')
      .where('sanmin.company_id = :company_id', { company_id });

    const cleanSearch = search?.trim();
    if (cleanSearch) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('sanmin.name ILIKE :search')
            .orWhere('sanmin.phone ILIKE :search')
            .orWhere('sanmin.workplace ILIKE :search')
            .orWhere('sanmin.description ILIKE :search')
            .orWhere('CAST(sanmin.id AS TEXT) LIKE :exactSearch');
        }),
        {
          search: `%${cleanSearch}%`,
          exactSearch: `${cleanSearch}%`,
        },
      );
    }

    const [data, total] = await query
      .orderBy('sanmin.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      data,
    };
  }


  async findOne(id: number): Promise<Sanmin> {
    const company_id = this.cls.get<number>('company_id');
    console.log("sanmin  findOne company_id");
    console.log(company_id);
    const sanmin = await this.sanminRepository.findOne({
      where: {
        id,
        company: { id: company_id }
      },
      relations: {
        company: true
      }
    });
    if (!sanmin) {
      throw new NotFoundException(`ID: ${id} bo'lgan sanmin tizimda topilmadi!`);
    }
    return sanmin;
  }

  

   async update(id: number, updateSanminDto: UpdateSanminDto) {
      await this.findOne(id);
      const sanmin = await this.sanminRepository.preload({
        id,
        ...updateSanminDto,
      });
      if (!sanmin) throw new NotFoundException(`Sanmin not found`);
      return await this.sanminRepository.save(sanmin);
    }
  

   async remove(id: number) {
    const sanmin = await this.findOne(id);
    return await this.sanminRepository.remove(sanmin);
  }
}
