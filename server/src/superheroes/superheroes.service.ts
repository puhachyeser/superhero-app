import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Superhero } from './schemas/superhero.schema';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';

@Injectable()
export class SuperheroesService {
  constructor(
    @InjectModel(Superhero.name) private superheroModel: Model<Superhero>,
  ) {}

  async create(createSuperheroDto: CreateSuperheroDto): Promise<Superhero> {
    const newHero = new this.superheroModel(createSuperheroDto);
    return newHero.save();
  }

  async findAll(page: number = 1, limit: number = 5) {
    const skip = (page - 1) * limit;
    const total = await this.superheroModel.countDocuments();
    const data = await this.superheroModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();

    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<Superhero> {
    const hero = await this.superheroModel.findById(id).exec();
    if (!hero) throw new NotFoundException(`Hero with id ${id} not found`);
    return hero;
  }

  async update(
    id: string,
    updateSuperheroDto: UpdateSuperheroDto,
  ): Promise<Superhero> {
    const updatedHero = await this.superheroModel
      .findByIdAndUpdate(id, updateSuperheroDto, { new: true })
      .exec();
    if (!updatedHero)
      throw new NotFoundException(`Hero with id ${id} not found`);
    return updatedHero;
  }

  async remove(id: string) {
    const result = await this.superheroModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Hero with id ${id} not found`);
    return { deleted: true };
  }
}
