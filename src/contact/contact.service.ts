import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name)
    private contactModel: Model<ContactDocument>,
  ) {}

  async create(createContactDto: CreateContactDto) {
    const data = new this.contactModel(createContactDto);
    return await data.save();
  }

  async importCsv(file, body): Promise<Partial<Contact>[]> {
    // TODO: import csv and create contacts in database
    const contacts = await this.contactModel.insertMany(
      JSON.parse(body.contactFileData),
    );
    return contacts;
  }

  findAll(options): Promise<Contact[]> {
    const sort = options.sort;
    const page: number = options.page || 1;
    const limit = options.limit || 10;

    const data = this.contactModel
      .find({}, {}, { sort })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'loanOfficer',
        select: ['firstName', 'lastName'],
        options: { strictPopulate: false },
      })
      .exec();

    return data;
  }

  async count() {
    return await this.contactModel.countDocuments();
  }

  async findOne(id: number) {
    return await this.contactModel.findById(id);
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    return await this.contactModel.findByIdAndUpdate(id, updateContactDto);
  }

  async remove(id: number) {
    return await this.contactModel.findByIdAndRemove(id);
  }
}
