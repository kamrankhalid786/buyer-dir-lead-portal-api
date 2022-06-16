import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  role: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Raw schema
// import * as mongoose from 'mongoose';

// export const UserSchema = new mongoose.Schema({
//   username: String,
//   name: String,
//   email: String,
//   avatar: String,
//   date: { type: Date, default: Date.now },
//   address: {
//     add1: String,
//     add2: String,
//     city: String,
//     state: String,
//     zip: String,
//     country: String,
//   },
//   password: {
//     type: String,
//     select: false,
//   },
// });
