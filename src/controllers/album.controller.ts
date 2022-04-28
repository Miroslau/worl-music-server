import {Body, Controller, Get, Post, Query, UploadedFiles, UseInterceptors} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {AlbumService} from "../services/album.service";
import {CreateAlbumDto} from "../dto/create-album.dto";

@ApiTags('Album')
@Controller('/album')
export class AlbumController {

    constructor(private albumService: AlbumService) {}

    @Post('/addAlbum')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'picture', maxCount: 1 }
    ]))
    create (@Body() dto: CreateAlbumDto, @UploadedFiles() files) {
        const { picture } = files;
        return this.albumService.create(dto, picture[0]);
    }

    @Get('/getAll')
    getAll (@Query('count') count: number,
            @Query('offset') offset: number) {
        return this.albumService.getAll(count, offset)
    }

    getById () {}

    update () {}

    delete () {}
}
