import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  //validate incoming request based on DTO
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true
  }))

  //Enable cookie-parser middleware\
  app.use(cookieParser())


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap(); 
