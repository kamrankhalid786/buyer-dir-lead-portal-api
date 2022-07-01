import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({
  collection: 'roles',
  timestamps: true,
  versionKey: false,
})
export class Role {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  deleted_at: Date;

  @Prop()
  is_deleted: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
