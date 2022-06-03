import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
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

import { CreatAuthorDto, UpdateAuthorDto } from '../dto';

import { Author } from '../schemas';

import { AuthorService } from '../services/author.service';

@ApiTags('Author')
@Controller('/authors')
export class AuthorsController {
    constructor(private readonly _authorService: AuthorService) {}

    @ApiOperation({ summary: 'Create author' })
    @ApiBody({ type: CreatAuthorDto })
    @ApiResponse({ status: 200, type: Author })
    @Post()
    @HttpCode(200)
    async createAuthor(@Body() dto: CreatAuthorDto): Promise<Author> {
      return this._authorService.createAuthor(dto);
    }

    @ApiOperation({ summary: 'Get all authors' })
    @ApiResponse({ type: [Author] })
    @Get('')
    async getAllAuthors(): Promise<Author[]> {
      return this._authorService.getAllAuthors();
    }

    @ApiOperation({ summary: 'Search author' })
    @ApiResponse({ type: [Author] })
    @ApiQuery({ name: 'query', example: 'Alex' })
    @Get('/search')
    async search(@Query('query') query: string): Promise<Author[]> {
      return this._authorService.search(query);
    }

    @ApiOperation({ summary: 'Get author by id' })
    @ApiResponse({ type: Author })
    @Get(':id')
    async getAuthorById(@Param('id') id: string): Promise<Author> {
      return this._authorService.getAuthorById(id);
    }

    @ApiOperation({ summary: 'Delete author' })
    @ApiResponse({ status: 200 })
    @Delete(':id')
    async deleteAuthor(@Param('id') id: string): Promise<ObjectId> {
      return this._authorService.deleteAuthor(id);
    }

    @ApiOperation({ summary: 'Update author' })
    @ApiBody({ type: UpdateAuthorDto })
    @ApiResponse({ status: 200, type: Author })
    @Put(':id')
    async updateAuthor(
        @Param('id') id: string,
        @Body() dto: UpdateAuthorDto,
    ): Promise<Author> {
      return this._authorService.updateAuthor(id, dto);
    }
}
