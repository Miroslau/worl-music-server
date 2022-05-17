import {
    Body,
    Controller,
    Delete,
    Get, HttpCode,
    Param,
    Post,
    Put,
    Query,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { ObjectId } from 'mongoose';

import { Album } from '../schemas/album.schema';

import { CreateAlbumDto } from '../dto/create-album.dto';
import { AddTracksToAlbumDto } from '../dto/create-track.dto';

import { AlbumService } from '../services/album.service';
import { UpdateAlbumDto } from '../dto/update-album.dto';


@ApiTags('Album')
@Controller('/albums')
export class AlbumController {

    constructor(private readonly __albumService__: AlbumService) {}

    @ApiOperation({ summary: 'Create album' })
    @ApiBody({ type: CreateAlbumDto })
    @ApiResponse({ status: 200, type: Album })
    @Post()
    @HttpCode(200)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'picture', maxCount: 1 }
    ]))
    async createAlbum(
      @Body() dto: CreateAlbumDto,
      @UploadedFiles() files,
    ): Promise<Album> {
      const { picture } = files;
      return this.__albumService__.createAlbum(dto, picture[0]);
    }

    @ApiOperation({ summary: `Add tracks to album` })
    @ApiBody({ type: AddTracksToAlbumDto })
    @ApiResponse({ status: 200, type: Album })
    @Post('/addTrackToAlbum')
    @HttpCode(200)
    async addTrackToAlbum(@Body() dto: AddTracksToAlbumDto): Promise<Album> {
      return this.__albumService__.addTrackToAlbum(dto);
    }

    @ApiOperation({ summary: `Get all albums` })
    @ApiResponse({ type: [Album] })
    @ApiQuery({ name: 'count', example: 4 })
    @ApiQuery({ name: 'offset', example: 0 })
    @Get()
    async getAllAlbums(
      @Query('count') count: number,
      @Query('offset') offset: number,
    ): Promise<Album[]> {
      return this.__albumService__.getAllAlbums(count, offset);
    }

    @ApiOperation({ summary: 'Get album by id' })
    @ApiResponse({ type: Album })
    @Get(':id')
    async getAlbumById(@Param('id') id: string): Promise<Album> {
      return this.__albumService__.getAlbumById(id);
    }

    @ApiOperation({ summary: 'Update album' })
    @ApiBody({ type: UpdateAlbumDto })
    @ApiResponse({ status: 200, type: Album })
    @Put(':id')
    @HttpCode(200)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'picture', maxCount: 1 }
    ]))
    async updateAlbum(
      @Param('id') id: string,
      @Body() dto: UpdateAlbumDto,
      @UploadedFiles() files,
    ): Promise<Album> {
      const { picture } = files;
      return this.__albumService__.updateAlbum(id, dto, picture[0]);
    }

    @ApiOperation({summary: 'delete album'})
    @ApiResponse({status: 200})
    @Delete(':id')
    async deleteAlbum(@Param('id') id: string): Promise<ObjectId> {
      return this.__albumService__.deleteAlbum(id);
    }
}
