import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Delete,
    UseInterceptors,
    UploadedFiles,
    Query, HttpCode,
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
    ApiBody,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';

import { ObjectId } from 'mongoose';

import { Track } from '../schemas/track.schema';
import { Comment } from '../schemas/comment.schema';

import { CreateTrackDto } from '../dto/create-track.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';

import { TrackService } from '../services/track.service';


@ApiTags('Track')
@Controller('/tracks')
export class TrackController {

    constructor(private readonly __trackService__: TrackService) {}

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
      return this.__trackService__.createTrack(dto, files);
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
      return this.__trackService__.getAllTracks(count, offset);
    }

    @ApiOperation({ summary: 'Search track by name' })
    @ApiQuery({ name: 'query', example: 'Tides' })
    @ApiResponse({ type: [Track] })
    @Get('/search')
    async searchTrack(@Query('query') query: string): Promise<Track[]> {
      return this.__trackService__.search(query);
    }

    @ApiOperation({ summary: 'Get track by id' })
    @ApiResponse({ type: Track })
    @Get(':id')
    async getTrackById(@Param('id') id: string): Promise<Track> {
      return this.__trackService__.getTrackById(id);
    }

    @ApiOperation({ summary: 'Delete track' })
    @ApiResponse({ status: 200 })
    @Delete(':id')
    async deleteTrack(@Param('id') id: string): Promise<ObjectId> {
      return this.__trackService__.deleteTrack(id);
    }

    @ApiOperation({ summary: 'Add comment by track' })
    @ApiBody({ type: CreateCommentDto })
    @ApiResponse({ status: 200, type: Comment })
    @Post('/comment')
    @HttpCode(200)
    async addComment(@Body() dto: CreateCommentDto): Promise<Comment> {
      return this.__trackService__.addComment(dto);
    }

    @ApiOperation({ summary: 'Increment property listens in track' })
    @ApiResponse({ status: 200, type: Track })
    @Post('/listen/:id')
    @HttpCode(200)
    async listenTrack(@Param('id') id: string): Promise<Track> {
      return this.__trackService__.listen(id);
    }
}
