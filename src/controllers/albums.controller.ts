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
    Header,
    UploadedFiles,
    UseInterceptors, Headers,
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

import { Album } from '../schemas';

import { CreateAlbumDto, AddTracksToAlbumDto, UpdateAlbumDto } from '../dto';

import { AlbumService } from '../services/album.service';

@ApiTags('Album')
@Controller('/albums')
export class AlbumsController {
    constructor(private readonly _albumService: AlbumService) {}

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
      @Headers() headers,
    ): Promise<Album> {
      const { picture } = files;
      const { host } = headers;
      return this._albumService.createAlbum(dto, picture[0], host);
    }

    @ApiOperation({ summary: 'Add tracks to album' })
    @ApiBody({ type: AddTracksToAlbumDto })
    @ApiResponse({ status: 200, type: Album })
    @Post('/addTrackToAlbum')
    @HttpCode(200)
    async addTrackToAlbum(@Body() dto: AddTracksToAlbumDto): Promise<Album> {
      return this._albumService.addTrackToAlbum(dto);
    }

    @ApiOperation({ summary: 'Get all albums' })
    @ApiResponse({ type: [Album] })
    @ApiQuery({ name: 'count', example: 4 })
    @ApiQuery({ name: 'offset', example: 0 })
    @Get()
    async getAllAlbums(
      @Query('count') count: number,
      @Query('offset') offset: number,
    ): Promise<Album[]> {
      return this._albumService.getAllAlbums(count, offset);
    }

    @ApiOperation({ summary: 'Get album by id' })
    @ApiResponse({ type: Album })
    @Get(':id')
    async getAlbumById(@Param('id') id: string): Promise<Album> {
      return this._albumService.getAlbumById(id);
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
      @Headers() headers,
    ): Promise<Album> {
      const { picture } = files;
      const { host } = headers;
      return this._albumService.updateAlbum(id, dto, picture[0], host);
    }

    @ApiOperation({ summary: 'delete album' })
    @ApiResponse({ status: 200 })
    @Delete(':id')
    async deleteAlbum(@Param('id') id: string): Promise<ObjectId> {
      return this._albumService.deleteAlbum(id);
    }
}
