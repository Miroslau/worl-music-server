import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthorService} from "../services/author.service";
import {CreatAuthorDto} from "../dto/creat-author.dto";
import {UpdateAuthorDto} from '../dto/update-author.dto';
import {Author} from "../schemas/author.schema";

@ApiTags('Author')
@Controller('/author')
export class AuthorController {

    constructor(private authorService: AuthorService) {}

    @ApiOperation({summary: 'create author'})
    @ApiBody({type: CreatAuthorDto})
    @ApiResponse({status: 201, type: Author})
    @Post('/createAuthor')
    create (@Body() dto: CreatAuthorDto) {
        return this.authorService.create(dto);
    }

    @ApiOperation({summary: 'get all authors'})
    @ApiResponse({status: 200, type: [Author]})
    @Get('/getAll')
    getAll () {
        return this.authorService.getAll();
    }

    @ApiOperation({summary: 'search Author'})
    @ApiResponse({status: 200, type: [Author]})
    @ApiQuery({name: 'query', example: 'Alex'})
    @Get('/search')
    search(@Query('query') query: string) {
        return this.authorService.search(query);
    }

    @ApiOperation({summary: 'get author by id'})
    @ApiResponse({status: 200, type: Author})
    @Get(':id')
    getById (@Param('id') id: string) {
        return this.authorService.getBiId(id);
    }

    @ApiOperation({summary: 'delete author'})
    @ApiResponse({status: 200})
    @Delete(':id')
    delete (@Param('id') id: string) {
        return this.authorService.delete(id);
    }

    @ApiOperation({summary: 'update author'})
    @ApiBody({type: UpdateAuthorDto})
    @ApiResponse({status: 200, type: Author})
    @Put(':id')
    update (@Param('id') id: string, @Body() dto: UpdateAuthorDto) {
        return this.authorService.update(id, dto);
    }
}
