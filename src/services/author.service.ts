import {Injectable, NotFoundException} from '@nestjs/common';
import {Author, AuthorDocument} from "../schemas/author.schema";
import {Model, ObjectId} from "mongoose";
import {CreatAuthorDto} from "../dto/creat-author.dto";
import {InjectModel} from "@nestjs/mongoose";
import {UpdateAuthorDto} from "../dto/update-author.dto";

@Injectable()
export class AuthorService {

    constructor(@InjectModel(Author.name) private authorModel: Model<AuthorDocument>) {}

    async create (dto: CreatAuthorDto): Promise<Author> {
        const author = await this.authorModel.create({...dto});
        return author;
    }

    async getAll (): Promise<Author[]> {
        const author = await this.authorModel.find();
        return author;
    }

    async getBiId (id: string): Promise<Author> {
        const author = await this.authorModel.findById(id).populate('album');
        return author;
    }

    async delete (id: string): Promise<ObjectId> {
        const author = await this.authorModel.findByIdAndDelete(id);
        return author._id;
    }

    async update (id: string, dto: UpdateAuthorDto): Promise<Author> {
        const author = await this.authorModel
            .findByIdAndUpdate(id, dto)
            .setOptions({overwrite: true, new: true})
            .populate('album');
        return author;
    }

    async search (query: string): Promise<Author[]> {
        const authors = await this.authorModel.find({
            name: {$regex: new RegExp(query, 'i')}
        });
        return authors;
    }
}
