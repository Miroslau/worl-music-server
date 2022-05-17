import { Document } from 'mongoose';

import { Album } from '../schemas/album.schema';

export type AlbumDocument = Album & Document;
