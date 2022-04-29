import {Body, Controller, Get, Param, Post, Put, Query, UploadedFiles, UseInterceptors} from "@nestjs/common";
import {ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {AlbumService} from "../services/album.service";
import {CreateAlbumDto} from "../dto/create-album.dto";
import {Album} from "../schemas/album.schema";
import {AddTracksToAlbumDto} from "../dto/create-track.dto";
import {ObjectId} from "mongoose";
import {UpdateAlbumDto} from "../dto/update-album.dto";

@ApiTags('Album')
@Controller('/album')
export class AlbumController {

    constructor(private albumService: AlbumService) {}

    @ApiOperation({summary: 'create album'})
    @ApiBody({type: CreateAlbumDto})
    @ApiResponse({status: 201, type: Album})
    @Post('/addAlbum')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'picture', maxCount: 1 }
    ]))
    create (@Body() dto: CreateAlbumDto, @UploadedFiles() files) {
        const { picture } = files;
        return this.albumService.create(dto, picture[0]);
    }

    @ApiOperation({summary: `add tracks to album`})
    @ApiBody({type: AddTracksToAlbumDto})
    @ApiResponse({status: 201, type: Album})
    @Post('/addTrackToAlbum')
    addTrackToAlbum (@Body() dto: AddTracksToAlbumDto) {
        return this.albumService.addTrackToAlbum(dto);

    }

    @ApiOperation({summary: `get all albums`})
    @ApiResponse({status: 200, type: [Album]})
    @ApiQuery({name: 'count', example: 4})
    @ApiQuery({name: 'offset', example: 0})
    @Get('/getAll')
    getAll (@Query('count') count: number,
            @Query('offset') offset: number) {
        return this.albumService.getAll(count, offset)
    }

    @ApiOperation({summary: 'get album by id'})
    @ApiResponse({status: 200, type: Album})
    @Get(':id')
    getById (@Param('id') id: string) {
        return this.albumService.getById(id);
    }

    @Put(':id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'picture', maxCount: 1 }
    ]))
    update (@Param('id') id: string,
            @Body() dto: UpdateAlbumDto,
            @UploadedFiles() files) {

        const { picture } = files;
        return this.albumService.update(id, dto, picture[0]);
    }

    delete () {}
}