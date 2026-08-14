import { Injectable, NotFoundException, ConflictException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity'; 
import { District } from './entities/district.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>, // Ma'lumotlar bazasiga ulanish
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  

  // 2. Barcha hududlarni olish
  async findAll() {
    return await this.regionRepository.find({
      order: { id: 'ASC' }, // Hududlarni ID tartibi bo'yicha tartiblaymiz
      relations:{
        district:true,
        company:true,
        user:true
      }
    });
  }


  async update(id:number,user_region_id:number){
    const region = await this.findOne(id);

    const user = await this.userService.findOne(user_region_id);

    if(!region){
      throw new NotFoundException("Region topilmadi")
    }
    if(!user){
      throw new NotFoundException("User topilmadi")
    }
    region.user=user

    return await  this.regionRepository.save(region)

  }

  async removeUserFromRegion(id: number) {
  // 1. Regionni bazadan qidiramiz
  const region = await this.findOne(id);

  // 2. Agar region topilmasa, xatolik qaytaramiz
  if (!region) {
    throw new NotFoundException("Region topilmadi");
  }

  // 3. Bog'liqlikni uzish uchun user xossasini null qilamiz
  region.user = null;

  // 4. O'zgarishni bazaga saqlaymiz
  return await this.regionRepository.save(region);
}


  // 2. Barcha hududlarni olish
  async findAllDistrict() {
    return await this.districtRepository.find({
      order: { id: 'ASC' }, // District ID tartibi bo'yicha tartiblaymiz
      relations:{
        region:true
      }
    });
  }

  // 3. ID bo'yicha bitta hududni topish
  async findOne(id: number) {
    const region = await this.regionRepository.findOne({
      where:{ id},
      relations:{
        district:true,
        company:true
      } 
      });
    if (!region) {
      throw new NotFoundException(`ID: ${id} bo'lgan hudud topilmadi!`);
    }
    return region;
  }

  async findOneDistrict(id: number) {
    const district = await this.districtRepository.findOne({
      where:{ id},
      relations:{
        region:true
      } 
      });
    if (!district) {
      throw new NotFoundException(`ID: ${id} bo'lgan tuman shahar topilmadi!`);
    }
    return district;
  }

  
}
