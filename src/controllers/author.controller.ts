import {
    Body,
    Controller,
    Delete,
    Get, HttpCode,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';

import {
    ApiBody,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { ObjectId } from 'mongoose';

import { CreatAuthorDto } from '../dto/creat-author.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';

import { Author } from '../schemas/author.schema';

import { AuthorService } from '../services/author.service';


@ApiTags('Author')
@Controller('/authors')
export class AuthorController {

    constructor(private readonly __authorService__: AuthorService) {}

    @ApiOperation({ summary: 'Create author' })
    @ApiBody({ type: CreatAuthorDto })
    @ApiResponse({ status: 200, type: Author })
    @Post()
    @HttpCode(200)
    async createAuthor(@Body() dto: CreatAuthorDto): Promise<Author> {
      return this.__authorService__.createAuthor(dto);
    }

    @ApiOperation({ summary: 'Get all authors' })
    @ApiResponse({ type: [Author] })
    @Get('')
    async getAllAuthors(): Promise<Author[]> {
      return this.__authorService__.getAllAuthors();
    }

    @ApiOperation({ summary: 'Search author' })
    @ApiResponse({ type: [Author] })
    @ApiQuery({ name: 'query', example: 'Alex' })
    @Get('/search')
    async search(@Query('query') query: string): Promise<Author[]> {
      return this.__authorService__.search(query);
    }

    @ApiOperation({ summary: 'Get author by id' })
    @ApiResponse({ type: Author })
    @Get(':id')
    async getAuthorById(@Param('id') id: string): Promise<Author> {
      return this.__authorService__.getAuthorById(id);
    }

    @ApiOperation({ summary: 'Delete author' })
    @ApiResponse({ status: 200 })
    @Delete(':id')
    async deleteAuthor(@Param('id') id: string): Promise<ObjectId> {
      return this.__authorService__.deleteAuthor(id);
    }

    @ApiOperation({ summary: 'Update author' })
    @ApiBody({ type: UpdateAuthorDto })
    @ApiResponse({ status: 200, type: Author })
    @Put(':id')
    async updateAuthor(
        @Param('id') id: string,
        @Body() dto: UpdateAuthorDto,
    ): Promise<Author> {
      return this.__authorService__.updateAuthor(id, dto);
    }
}
