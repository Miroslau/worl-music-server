import {Body, Controller, Get, Param, Post, Delete, UseInterceptors, UploadedFiles, Query} from "@nestjs/common";
import {TrackService} from "../services/track.service";
import {CreateTrackDto} from "../dto/create-track.dto";
import {ObjectId} from "mongoose";
import {CreateCommentDto} from "../dto/create-comment.dto";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Track} from "../schemas/track.schema";


@ApiTags('Track')
@Controller('/tracks')
export class TrackController {

    constructor(private trackService: TrackService) {}

    @ApiOperation({summary: 'create track'})
    @ApiBody({type: Track})
    @ApiResponse({status: 200, type: Track})
    @Post('/addTrack')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'picture', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
    ]))
     create(@UploadedFiles() files, @Body() dto: CreateTrackDto) {
        return this.trackService.create(dto, files);
    }

    @ApiOperation({summary: 'get all tracks'})
    @ApiResponse({status: 200, type: [Track]})
    @ApiQuery({name: 'count', example: 10})
    @ApiQuery({name: 'offset', example: 0})
    @Get('/getAll')
     getAll(@Query('count') count: number,
            @Query('offset') offset: number) {
         return this.trackService.getAll(count, offset);
    }

    @ApiOperation({summary: 'search track by name'})
    @ApiQuery({name: 'query', example: 'Tides'})
    @ApiResponse({status: 200, type: [Track]})
    @Get('/search')
    search(@Query('query') query: string) {
        return this.trackService.search(query);
    }

    @Get(':id')
     getById(@Param('id') id: ObjectId) {
        return this.trackService.getById(id);
    }

    @Delete(':id')
     delete(@Param('id') id: ObjectId) {
        return this.trackService.delete(id);
    }

    @Post('/comment')
    addComment(@Body() dto: CreateCommentDto) {
        return this.trackService.addComment(dto);
    }

    @Post('/listen/:id')
    listen(@Param('id') id: ObjectId) {
        return this.trackService.listen(id);
    }
}