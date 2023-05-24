import {Test, TestingModule} from '@nestjs/testing';
import {AdminService} from '../../services/admin.service';
import {moduleMetadataHelper} from '../../libs/module-metadata-helper';

describe('AdminServiceTest', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(moduleMetadataHelper).compile();
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
