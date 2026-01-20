import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Superhero extends Document {
  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true })
  real_name: string;

  @Prop()
  origin_description: string;

  @Prop({ required: true })
  superpowers: string;

  @Prop()
  catch_phrase: string;

  @Prop([String])
  images: string[];
}

export const SuperheroSchema = SchemaFactory.createForClass(Superhero);
