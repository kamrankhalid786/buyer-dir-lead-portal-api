import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ParameterDocument = Parameter & Document;

@Schema({ timestamps: true, collection: 'parameters', versionKey: false })
export class Parameter {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  dividend: number;

  @Prop({ required: false })
  divisor: number;

  @Prop({ required: false })
  multiplier: number;

  @Prop({ type: Types.ObjectId, ref: 'Role' })
  roleId: Types.ObjectId;
}

export const ParameterSchema = SchemaFactory.createForClass(Parameter);
