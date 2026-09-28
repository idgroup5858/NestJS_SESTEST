import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSanminDto } from './dto/create-sanmin.dto';
import { UpdateSanminDto } from './dto/update-sanmin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sanmin } from './entities/sanmin.entity';
import { Repository } from 'typeorm';
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
