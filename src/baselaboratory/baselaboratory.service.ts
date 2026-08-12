import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBaselaboratoryDto } from './dto/create-baselaboratory.dto';
import { UpdateBaselaboratoryDto } from './dto/update-baselaboratory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Baselaboratory } from './entities/baselaboratory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BaselaboratoryService {
   constructor(
      @InjectRepository(Baselaboratory)
      private readonly baselaboratoryRepository: Repository<Baselaboratory>,
  
   
    ) { }
  
  
    async create(createBaseLaboratoryDto: CreateBaselaboratoryDto) {
     
  
      const {  ...rest } = createBaseLaboratoryDto;
  
      const laboratory = this.baselaboratoryRepository.create({
        ...rest
      });
  
     
      return await this.baselaboratoryRepository.save(laboratory);
    }
  
    async findAll() {
     
      return await this.baselaboratoryRepository.find({        
        relations: {
          baseanalysis: true
        }
      });
    }
  
    async findAllPagSearch(page: number, limit: number, search?: string) {
  
  
     
  
      page = page > 0 ? page : 1;
      limit = limit > 0 ? limit : 10;
  
      const skip = (page - 1) * limit;
  
      const query = this.baselaboratoryRepository.createQueryBuilder('baselaboratory')
        .leftJoinAndSelect('baselaboratory.baseanalysis', 'baseanalysis')
        
  
      if (search) {
        query.where(
          'baselaboratory.name ILIKE :search', //LIKE MYSQL ILIKE POSTGRESQL
          { search: `%${search}%` }
        );
      }
  
  
      const [data, total] = await query
        .orderBy('baselaboratory.id', 'DESC')
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
  
    // 3. ID bo'yicha bitta laboratoriyani topish
    async findOne(id: number) {
  
     
  
  
      const laboratory = await this.baselaboratoryRepository.findOne({
        where: {
          id: id
        },
        relations: {
          baseanalysis: true
        }
      });
  
  
      if (!laboratory) {
        throw new NotFoundException(`ID: ${id} bo'lgan baselaboratoriya topilmadi!`);
      }
      return laboratory;
    }
  
  
  
  
    async update(id: number, updateBaseLaboratoryDto: UpdateBaselaboratoryDto) {
  
     
  
      const {  ...rest } = updateBaseLaboratoryDto;
  
      const laboratory = await this.baselaboratoryRepository.preload({
        id, ...rest
      });
  
      if (!laboratory) {
        throw new NotFoundException(`ID: ${id} bo'lgan laboratoriya topilmadi!`);
      }
  
     
  
      return this.baselaboratoryRepository.save(laboratory);
    }
  
  
  
    async remove(id: number) {
      const laboratory = await this.findOne(id);
      await this.baselaboratoryRepository.remove(laboratory);
  
  
      return {
        success: true,
        message: 'Laboratory deleted successfully',
        id: id,
      };
    }
  
  
    
  
  
}
