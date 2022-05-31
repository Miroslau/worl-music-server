import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './modules/app.module';

const start = async () => {
    try {
      const PORT = process.env.PORT || 5000;
      const app = await  NestFactory.create(AppModule);

      app.setGlobalPrefix('api');

      const config = new DocumentBuilder()
                         .setTitle('Spotify')
                         .setDescription(`The Potify's API description`)
                         .setVersion('0.0.1')
                         .build();

      const document = SwaggerModule.createDocument(app, config);

      SwaggerModule.setup('/api/docs', app, document);

      await app.listen(PORT, () => console.log(`server started on PORT ${ PORT }`));

    } catch (e) {
        console.log(e);
    }
}

start();
