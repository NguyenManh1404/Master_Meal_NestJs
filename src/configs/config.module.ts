import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import globalConfiguration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [globalConfiguration],
    }),
  ],
})
export class GlobalConfigModule {
}
