import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Superhero } from './schemas/superhero.schema';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';

@Injectable()
export class SuperheroesService implements OnModuleInit {
  constructor(
    @InjectModel(Superhero.name) private superheroModel: Model<Superhero>,
  ) {}

  async onModuleInit() {
    const count = await this.superheroModel.countDocuments();
    if (count === 0) {
      const seedHeroes = [
        {
          nickname: 'Superman',
          real_name: 'Clark Kent',
          origin_description:
            "He was born Kal-El on the planet Krypton, before being rocketed to Earth as an infant by his scientist father Jor-El, moments before Krypton's destruction.",
          superpowers:
            'Solar energy absorption and healing factor, solar flare and heat vision, solar invulnerability, flight.',
          catch_phrase:
            "Look, up in the sky, it's a bird, it's a plane, it's Superman!",
          images: [
            'https://i.pinimg.com/1200x/52/9b/2e/529b2e2348170b92f7be61c27bbfa359.jpg',
            'https://i.pinimg.com/736x/c2/c7/d6/c2c7d64ce58f78448fa40bf158b9818a.jpg',
            'https://i.pinimg.com/1200x/17/0a/d5/170ad5bdb29741bff8fa36cb409e8711.jpg',
            'https://i.pinimg.com/736x/01/a4/ad/01a4ad6a2f6163d9617d209d73b715be.jpg',
          ],
        },
        {
          nickname: 'Batman',
          real_name: 'Bruce Wayne',
          origin_description:
            'After witnessing the murder of his parents as a child, billionaire Bruce Wayne dedicated his life to fighting crime. He trained himself to the peak of human potential.',
          superpowers:
            'Genius-level intellect, master martial artist, high-tech gadgets, and vast wealth.',
          catch_phrase: "I'm Batman.",
          images: [
            'https://i.pinimg.com/736x/42/e6/b4/42e6b484930e3bbc330610da34d4648b.jpg',
            'https://i.pinimg.com/1200x/3c/23/fa/3c23fae491774b8815076878fda9f281.jpg',
            'https://i.pinimg.com/1200x/f5/28/e6/f528e6da58d11d59b30d25aa1a150940.jpg',
            'https://i.pinimg.com/1200x/48/51/60/485160c55c513f8eac38027385f38a52.jpg',
          ],
        },
        {
          nickname: 'Spider-Man',
          real_name: 'Peter Parker',
          origin_description:
            'High school student Peter Parker was bitten by a radioactive spider, granting him incredible abilities. He learned that with great power comes great responsibility.',
          superpowers:
            'Wall-clinging, spider-sense, incredible agility, and homemade web-shooters.',
          catch_phrase: 'With great power comes great responsibility.',
          images: [
            'https://i.pinimg.com/736x/8c/7b/79/8c7b799037e6ed2a23e3b664787e927c.jpg',
            'https://i.pinimg.com/736x/e5/e5/36/e5e536cd1e4baedbe7b055b7470cfce1.jpg',
            'https://i.pinimg.com/736x/fa/05/8b/fa058b5b841fe7ec19a84bb08ddcb95c.jpg',
            'https://i.pinimg.com/1200x/3a/95/ea/3a95ea103c6927da319508ef2bb28420.jpg',
          ],
        },
        {
          nickname: 'The Flash',
          real_name: 'Barry Allen',
          origin_description:
            'A forensic scientist struck by lightning and doused in chemicals, gaining access to the Speed Force, making him the fastest man alive.',
          superpowers:
            'Superhuman speed, vibrating through objects, and time travel.',
          catch_phrase:
            "Life is locomotion. If you're not moving, you're not living.",
          images: [
            'https://i.pinimg.com/736x/e9/2a/8f/e92a8fa51a2dfb6c8bc054ba88ec735c.jpg',
            'https://i.pinimg.com/736x/80/bc/73/80bc736ae3b97f180b904070aeb6e592.jpg',
            'https://i.pinimg.com/736x/10/40/bf/1040bfe87152cd4fe88f6e767ada654f.jpg',
            'https://i.pinimg.com/1200x/10/cc/15/10cc153eca8818eb3e688c30bbbd2742.jpg',
          ],
        },
        {
          nickname: 'Captain America',
          real_name: 'Steve Rogers',
          origin_description:
            'A sickly volunteer during WWII who was given the Super Soldier serum. After being frozen in ice for decades, he returned as a symbol of honor.',
          superpowers:
            'Peak human physical condition, expert shield mastery, and exceptional leadership.',
          catch_phrase: 'I can do this all day.',
          images: [
            'https://i.pinimg.com/736x/d5/3e/8a/d53e8ac4dcdf52c0f1234a740c233391.jpg',
            'https://i.pinimg.com/736x/8d/c8/42/8dc8428e7b1ac3c649a93d8e8714c8b3.jpg',
            'https://i.pinimg.com/1200x/6e/aa/2c/6eaa2ca42e3f867b92621d6910a3a925.jpg',
            'https://i.pinimg.com/736x/3b/97/23/3b97230cae555b8a481e8220e07d3611.jpg',
          ],
        },
        {
          nickname: 'Iron Man',
          real_name: 'Tony Stark',
          origin_description:
            'A billionaire inventor who was captured and suffered a heart injury. He built a high-tech armored suit to escape and now uses it to protect the world.',
          superpowers:
            'Genius IQ, flight, and weaponry provided by an AI-controlled suit of armor.',
          catch_phrase: 'I am Iron Man.',
          images: [
            'https://i.pinimg.com/736x/9d/b3/a8/9db3a8156aae930919ca3869e1ed11ff.jpg',
            'https://i.pinimg.com/1200x/8b/7e/51/8b7e51941394b188469856ff6d2c28dc.jpg',
            'https://i.pinimg.com/1200x/7f/f4/6a/7ff46a81b719d8769b203b1e3f53a84e.jpg',
            'https://i.pinimg.com/1200x/a4/fe/6f/a4fe6fdafcb95b9c14cb6bc90ef54cb7.jpg',
          ],
        },
        {
          nickname: 'Aquaman',
          real_name: 'Arthur Curry',
          origin_description:
            'The son of a lighthouse keeper and the Queen of Atlantis, Arthur is the heir to the underwater throne who must unite two worlds.',
          superpowers:
            'Breathe underwater, telepathic communication with marine life, superhuman strength.',
          catch_phrase: 'The sea carries many secrets.',
          images: [
            'https://i.pinimg.com/1200x/35/97/77/3597774276b0bde66968c39ef1754e5d.jpg',
            'https://i.pinimg.com/1200x/71/5b/8d/715b8d794b71d5b103f91eebf968ce8e.jpg',
            'https://i.pinimg.com/736x/62/16/97/621697a66ad051fb6533cd0d589e82cb.jpg',
            'https://i.pinimg.com/1200x/5a/3f/e7/5a3fe74b844708b606025954017f8919.jpg',
          ],
        },
        {
          nickname: 'Thor',
          real_name: 'Thor Odinson',
          origin_description:
            'The Crown Prince of Asgard and the God of Thunder. After his arrogance reignited an ancient war, his father Odin stripped him of his powers and cast him down to Earth as a mortal. Only by learning humility was he able to reclaim his mantle and his enchanted hammer, Mjolnir.',
          superpowers:
            'Immense superhuman strength, longevity, and control over weather and lightning. He wields Mjolnir, which allows him to fly and channel devastating energy blasts.',
          catch_phrase:
            'Whosoever holds this hammer, if he be worthy, shall possess the power of Thor.',
          images: [
            'https://i.pinimg.com/736x/df/f1/dd/dff1ddc600819e5f1aa8e95a788d5584.jpg',
            'https://i.pinimg.com/1200x/1b/08/be/1b08bea51c685f92bf92175ad8075181.jpg',
            'https://i.pinimg.com/736x/f8/0a/e7/f80ae7596fbcd4a8a2fc869bf9b5b704.jpg',
            'https://i.pinimg.com/736x/dd/98/34/dd9834b22e6f7e8e5e62530d34f87ed9.jpg',
          ],
        },
      ];

      await this.superheroModel.insertMany(seedHeroes);
      console.log('Successfully seeded database with 8 superheroes!');
    }
  }

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
