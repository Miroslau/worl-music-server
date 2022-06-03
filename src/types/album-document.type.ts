import { Document } from 'mongoose';

import { Album } from '../schemas';

export type AlbumDocument = Album & Document;
