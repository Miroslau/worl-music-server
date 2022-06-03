import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Delete,
    UseInterceptors,
    UploadedFiles,
    Query,
    HttpCode,
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';

import {
    ApiBody,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { ObjectId } from 'mongoose';

import { Track, Comment } from '../schemas';

import { CreateTrackDto, CreateCommentDto } from '../dto';

import { TrackService } from '../services/track.service';

@ApiTags('Track')
@Controller('/tracks')
export class TracksController {
    constructor(private readonly _trackService: TrackService) {}

    @ApiOperation({ summary: 'Create track' })
    @ApiBody({ type: Track })
    @ApiResponse({ status: 200, type: Track })
    @Post()
    @HttpCode(200)
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]))
    async createTrack(
      @UploadedFiles() files,
      @Body() dto: CreateTrackDto,
    ): Promise<Track> {
      return this._trackService.createTrack(dto, files);
    }

    @ApiOperation({ summary: 'Get all tracks' })
    @ApiResponse({ type: [Track] })
    @ApiQuery({ name: 'count', example: 10 })
    @ApiQuery({ name: 'offset', example: 0 })
    @Get()
    async getAllTracks(
      @Query('count') count: number,
      @Query('offset') offset: number,
    ): Promise<Track[]> {
      return this._trackService.getAllTracks(count, offset);
    }

    @ApiOperation({ summary: 'Search track by name' })
    @ApiQuery({ name: 'query', example: 'Tides' })
    @ApiResponse({ type: [Track] })
    @Get('/search')
    async searchTrack(@Query('query') query: string): Promise<Track[]> {
      return this._trackService.search(query);
    }

    @ApiOperation({ summary: 'Get track by id' })
    @ApiResponse({ type: Track })
    @Get(':id')
    async getTrackById(@Param('id') id: string): Promise<Track> {
      return this._trackService.getTrackById(id);
    }

    @ApiOperation({ summary: 'Delete track' })
    @ApiResponse({ status: 200 })
    @Delete(':id')
    async deleteTrack(@Param('id') id: string): Promise<ObjectId> {
      return this._trackService.deleteTrack(id);
    }

    @ApiOperation({ summary: 'Add comment by track' })
    @ApiBody({ type: CreateCommentDto })
    @ApiResponse({ status: 200, type: Comment })
    @Post('/comment')
    @HttpCode(200)
    async addComment(@Body() dto: CreateCommentDto): Promise<Comment> {
      return this._trackService.addComment(dto);
    }

    @ApiOperation({ summary: 'Increment property listens in track' })
    @ApiResponse({ status: 200, type: Track })
    @Post('/listen/:id')
    @HttpCode(200)
    async listenTrack(@Param('id') id: string): Promise<Track> {
      return this._trackService.listen(id);
    }
}
