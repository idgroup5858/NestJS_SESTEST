import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Deal } from './entities/deal.entity';
import { Brackets, Repository } from 'typeorm';
import { CompanyService } from 'src/company/company.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class DealService {

  constructor(
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,
    private companyService: CompanyService,
    readonly cls: ClsService,
  ) { }



  async create(createDealDto: CreateDealDto) {
    const company_id = this.cls.get<number>('company_id');
    console.log("deal  create company_id");
    console.log(company_id);

    const deal = this.dealRepository.create({
      ...createDealDto
    });

    if (company_id) {
      const company = await this.companyService.findOne(company_id)
      if (!company) throw new NotFoundException("Company not found");
      deal.company = company
    }
    return await this.dealRepository.save(deal);
  }

  async findAll() {
    const company_id = this.cls.get<number>('company_id');
    console.log("deal  findall company_id");
    console.log(company_id);

    return await this.dealRepository.find({
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

    const query = this.dealRepository
      .createQueryBuilder('deal')
      .where('deal.company_id = :company_id', { company_id });

    const cleanSearch = search?.trim();
    if (cleanSearch) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('deal.name ILIKE :search')
            .orWhere('deal.number ILIKE :search')
            .orWhere('deal.owner_name ILIKE :search')
            .orWhere('CAST(deal.id AS TEXT) LIKE :exactSearch');
        }),
        {
          search: `%${cleanSearch}%`,
          exactSearch: `${cleanSearch}%`,
        },
      );
    }

    const [data, total] = await query
      .orderBy('deal.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      data,
    };
  }


  async findDealTotalAmountRange(
    search?: string,
    payment_method?: string,
    payment_status?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const company_id = this.cls.get<number>('company_id');

    const query = this.dealRepository.createQueryBuilder('deal');

    if (company_id) {
      query.where('deal.company_id = :company_id', { company_id });
    } else {
      query.where('1=1');
    }

    if (search && search.trim() !== '') {
      query.andWhere(
        '(deal.name ILIKE :search OR deal.number ILIKE :search OR deal.owner_name ILIKE :search)',
        { search: `%${search.trim()}%` },
      );
    }

    if (payment_method) {
      query.andWhere('deal.payment_method = :payment_method', { payment_method });
    }

    if (payment_status) {
      query.andWhere('deal.payment_status = :payment_status', { payment_status });
    }

    if (startDate && endDate) {
      query.andWhere(
        'deal.createdAt BETWEEN :start AND :end',
        {
          start: `${startDate} 00:00:00.000`,
          end: `${endDate} 23:59:59.999`,
        },
      );
    }

    const result = await query
      .select("COALESCE(SUM(CAST(NULLIF(deal.amount, '') AS NUMERIC)), 0)", 'totalAmount')
      .addSelect('COUNT(deal.id)', 'count')
      .getRawOne();

    return {
      totalAmount: parseFloat(result.totalAmount),
      count: parseInt(result.count, 10),
    };
  }



  async findOne(id: number): Promise<Deal> {
    const company_id = this.cls.get<number>('company_id');
    console.log("deal  findOne company_id");
    console.log(company_id);
    const deal = await this.dealRepository.findOne({
      where: {
        id,
        company: { id: company_id }
      },
      relations: {
        company: true
      }
    });
    if (!deal) {
      throw new NotFoundException(`ID: ${id} bo'lgan deal tizimda topilmadi!`);
    }
    return deal;
  }



  async update(id: number, updateDealDto: UpdateDealDto) {
    await this.findOne(id);
    const deal = await this.dealRepository.preload({
      id,
      ...updateDealDto,
    });
    if (!deal) throw new NotFoundException(`Deal not found`);
    return await this.dealRepository.save(deal);
  }


  async remove(id: number) {
    const deal = await this.findOne(id);
    return await this.dealRepository.remove(deal);
  }
}
