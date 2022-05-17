import { Document } from 'mongoose';

import { Author } from '../schemas/author.schema';

export type AuthorDocument = Author & Document;
