import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateGeminiDto } from './dto/create-gemini.dto';
import { UpdateGeminiDto } from './dto/update-gemini.dto';
import { GoogleGenAI } from '@google/genai';
import { UserService } from 'src/user/user.service';
import { LaboratoryService } from 'src/laboratory/laboratory.service';
import { AnalysisService } from 'src/analysis/analysis.service';
import { OrderService } from 'src/order/order.service';
import { PatientService } from 'src/patient/patient.service';



const myTools = {
  functionDeclarations: [
    {
      name: "getAllLaboratory",
      description: "Laboratoriya haqida malumot beradi va laboratoriyaga tegishli analysis haqida ham malumot beradi. agar laboratory body ichida analysis bolsa uni ham laboratory deb hisoblab yuborma",
      parameters: { type: "OBJECT", properties: {} }
    },
    {
      name: "getAllAnalysis",
      description: "Analysis , tahlil haqida malumot beradi",
      parameters: { type: "OBJECT", properties: {} }
    },
    {
      name: "getAllOrder",
      description: "Order, Zakaz, Buyurtmalar haqida malumot beradi, agar ingliz tilida bolsa json ozbek tilida yozib javob qaytarishkerak,agar sana vaqtlarga bog'liq malumotlar so'ralsa bugungi kundagi sanadan boshlab hisoblansin",
      parameters: { type: "OBJECT", properties: {} }
    },
     {
      name: "getAllPatient",
      description: "Bemorlar,Kasallar,Klientlar haqida malumot beradi",
      parameters: { type: "OBJECT", properties: {} }
    },
    // YANGI QO'SHILDI: Ikkinchi funksiyaning Gemini uchun yo'riqnomasi
    {
      name: "getAllUsers",
      description: "Tizimda jami nechta ro'yxatdan o'tgan foydalanuvchilar borligini bilish uchun foydalanuvchilar sonini olib beradi.",
      parameters: { type: "OBJECT", properties: {} }
    }
  ]
};


@Injectable()
export class GeminiService {

  private ai = new GoogleGenAI({
    vertexai: false,
    apiKey: "AIzaSyB3KqydF5B0Aa7JkrzblJQxcUvlkvTQrLw", // O'zingizning API kalitingizni qo'ying
  });

  constructor(
    // @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly laboratoryService: LaboratoryService,
    private readonly analysisService: AnalysisService,
    private readonly orderService:OrderService,
    private readonly patientService:PatientService
  ) { }

  async create(createGeminiDto: CreateGeminiDto) {
    // Model nomini o'zgarmas o'zgaruvchiga olamiz (ikkala so'rovda ham bir xil bo'lishi shart)
    const modelName = 'gemini-3.5-flash-lite';

    // 1. Birinchi marta Gemini-ga foydalanuvchi so'rovini yuboramiz
    try{
      const response = await this.ai.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts: [{ text: createGeminiDto.msg }] }], // obyekt formatida uzatish tavsiya etiladi
      config: {
        tools: [myTools as any]
      }
    });

    // 2. Gemini funksiyani chaqirishni so'rayaptimi yoki yo'qligini tekshiramiz
    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      const functionName = call.name;

      console.log(`🤖 Gemini funksiyani chaqirishni so'radi: ${functionName}`);

      if (functionName === "getAllUsers") {
        // Bazadan ma'lumotni olamiz
        const functionResult = await this.userService.findAll();
        console.log(`📦 DB dan olingan ma'lumot:`, functionResult);

        // Modelning birinchi qaytargan tayyor content obyekti (ichida o'sha muhim thought_signature bor)
        const modelContent = response.candidates?.[0]?.content;

        if (!modelContent) {
          throw new Error("Model javobidan content topilmadi.");
        }
        const answer = await this.recallFunction(modelName, createGeminiDto.msg, functionName, functionResult, modelContent)
        return answer;
      }

      if (functionName === "getAllLaboratory") {
        // Bazadan ma'lumotni olamiz
        const functionResult = await this.laboratoryService.findAll();
        console.log(`📦 DB dan olingan ma'lumot:`, functionResult);

        // Modelning birinchi qaytargan tayyor content obyekti (ichida o'sha muhim thought_signature bor)
        const modelContent = response.candidates?.[0]?.content;

        if (!modelContent) {
          throw new Error("Model javobidan content topilmadi.");
        }
        const answer = await this.recallFunction(modelName, createGeminiDto.msg, functionName, functionResult, modelContent)
        return answer;
      }

      if (functionName === "getAllAnalysis") {
        // Bazadan ma'lumotni olamiz
        const functionResult = await this.analysisService.findAll();
        console.log(`📦 DB dan olingan ma'lumot:`, functionResult);

        // Modelning birinchi qaytargan tayyor content obyekti (ichida o'sha muhim thought_signature bor)
        const modelContent = response.candidates?.[0]?.content;

        if (!modelContent) {
          throw new Error("Model javobidan content topilmadi.");
        }
        const answer = await this.recallFunction(modelName, createGeminiDto.msg, functionName, functionResult, modelContent)
        return answer;
      }

       if (functionName === "getAllOrder") {
        // Bazadan ma'lumotni olamiz
        const functionResult = await this.orderService.findAll();
        console.log(`📦 DB dan olingan ma'lumot:`, functionResult);

        // Modelning birinchi qaytargan tayyor content obyekti (ichida o'sha muhim thought_signature bor)
        const modelContent = response.candidates?.[0]?.content;

        if (!modelContent) {
          throw new Error("Model javobidan content topilmadi.");
        }
        const answer = await this.recallFunction(modelName, createGeminiDto.msg, functionName, functionResult, modelContent)
        return answer;
      }
      if (functionName === "getAllPatient") {
        // Bazadan ma'lumotni olamiz
        const functionResult = await this.patientService.findAll();
        console.log(`📦 DB dan olingan ma'lumot:`, functionResult);

        // Modelning birinchi qaytargan tayyor content obyekti (ichida o'sha muhim thought_signature bor)
        const modelContent = response.candidates?.[0]?.content;

        if (!modelContent) {
          throw new Error("Model javobidan content topilmadi.");
        }
        const answer = await this.recallFunction(modelName, createGeminiDto.msg, functionName, functionResult, modelContent)
        return answer;
      }
    }

    return { answer_msg: response.text };
    }catch(e){
      return {error:e.message}
    }
    
  }

  async recallFunction(modelName: string, msg: string, functionName?: string, functionResult?: any, modelContent?: any) {

    const finalResponse = await this.ai.models.generateContent({
      model: modelName, // Bir xil model nomi bo'lishi shart!
      contents: [
        { role: 'user', parts: [{ text: msg }] }, // 1. Foydalanuvchining asl xabari
        modelContent, // 2. Modelning funksiya chaqiruvi (thought_signature bilan birga)
        {
          role: 'user', // Yangi SDK bo'yicha functionResponse ham 'user' roliga tegishli bo'ladi
          parts: [{
            functionResponse: {
              name: functionName,
              response: { data: functionResult } // Natija har doim obyekt ichida bo'lishi shart
            }
          }]
        }
      ]
    });
    const cleanText = finalResponse.text ? finalResponse.text.replace(/\*\*/g, '') : '';
    console.log("🤖 Gemini-ning yakuniy javobi:", cleanText);
    return { answer_msg: cleanText };
  }

  // async getAllUsers() {
  //   // Bazadan barcha foydalanuvchilar keldi deb tasavvur qilamiz
  //   return { count: 1550 };
  // }

  findAll() {
    return `This action returns all gemini`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gemini`;
  }

  update(id: number, updateGeminiDto: UpdateGeminiDto) {
    return `This action updates a #${id} gemini`;
  }

  remove(id: number) {
    return `This action removes a #${id} gemini`;
  }
}
