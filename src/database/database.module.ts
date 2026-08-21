import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

    imports:[
        TypeOrmModule.forRoot({
            type:"postgres",
            host:"localhost",
            port:5433, //from pr
            username:"postgres", 
            password:"root",     
            database:"prsestest",    
            autoLoadEntities:true,
            synchronize:true
        })
    ]
})
export class DatabaseModule {}