import {
  Test as NestTest,
  TestingModule as NestTestingModule,
} from '@nestjs/testing';
import { SuperheroesService } from './superheroes.service';
import { getModelToken } from '@nestjs/mongoose';
import { Superhero } from './schemas/superhero.schema';
import { Model, Types } from 'mongoose';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';

describe('SuperheroesService', () => {
  let service: SuperheroesService;
  let model: Model<Superhero>;

  const mockSuperheroModel = {
    countDocuments: jest.fn(),
    find: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    save: jest.fn(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    insertMany: jest.fn(),
  };

  interface MockModelContext {
    data: CreateSuperheroDto;
    save: jest.Mock;
  }

  function MockModel(this: MockModelContext, dto: CreateSuperheroDto) {
    this.data = dto;
    this.save = mockSuperheroModel.save;
  }

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: NestTestingModule = await NestTest.createTestingModule({
      providers: [
        SuperheroesService,
        {
          provide: getModelToken(Superhero.name),
          useValue: Object.assign(MockModel, mockSuperheroModel),
        },
      ],
    }).compile();

    service = module.get<SuperheroesService>(SuperheroesService);
    model = module.get<Model<Superhero>>(getModelToken(Superhero.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

  it('should return a list of heroes (findAll)', async () => {
    const mockHeroes = [{ _id: new Types.ObjectId(), nickname: 'Superman' }];
    mockSuperheroModel.countDocuments.mockResolvedValue(1);
    mockSuperheroModel.exec.mockResolvedValue(mockHeroes);

    const result = await service.findAll(1, 5);

    expect(result.data).toEqual(mockHeroes);
    expect(result.total).toBe(1);
    expect(mockSuperheroModel.find).toHaveBeenCalled();
  });

  it('should create a new hero (create)', async () => {
    const dto: CreateSuperheroDto = {
      nickname: 'Thor',
      real_name: 'Thor Odinson',
      origin_description: 'Asgard',
      superpowers: 'Lightning',
      catch_phrase: 'Worthy',
      images: [],
    };
    mockSuperheroModel.save.mockResolvedValue(dto);

    const result = await service.create(dto);

    expect(result).toEqual(dto);
    expect(mockSuperheroModel.save).toHaveBeenCalled();
  });

  it('should find one hero by id (findOne)', async () => {
    const id = new Types.ObjectId();
    const mockHero = { _id: id, nickname: 'Batman' };
    mockSuperheroModel.exec.mockResolvedValue(mockHero);

    const result = await service.findOne(id.toHexString());

    expect(result).toEqual(mockHero);
    expect(mockSuperheroModel.findById).toHaveBeenCalledWith(id.toHexString());
  });

  it('should update a hero (update)', async () => {
    const dto: UpdateSuperheroDto = { nickname: 'Iron Man Updated' };
    mockSuperheroModel.exec.mockResolvedValue(dto);

    const result = await service.update('123', dto);

    expect(result).toEqual(dto);
    expect(mockSuperheroModel.findByIdAndUpdate).toHaveBeenCalledWith(
      '123',
      dto,
      { new: true },
    );
  });

  it('should delete a hero (remove)', async () => {
    const id = new Types.ObjectId();
    const mockStatus = { deleted: true };
    mockSuperheroModel.exec.mockResolvedValue(mockStatus);

    const result = await service.remove(id.toHexString());

    expect(result).toEqual(mockStatus);
    expect(mockSuperheroModel.findByIdAndDelete).toHaveBeenCalledWith(
      id.toHexString(),
    );
  });
});
