import {Module} from '@nestjs/common';
import {moduleMetadataHelper} from './libs/module-metadata-helper';

@Module(moduleMetadataHelper)
export class ApiModule {}
