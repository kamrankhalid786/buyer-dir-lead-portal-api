import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true, collection: 'contacts', versionKey: false })
export class Contact {
  // @Prop({ type: Types.ObjectId })
  // _id: Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  loanOfficer: Types.ObjectId;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
