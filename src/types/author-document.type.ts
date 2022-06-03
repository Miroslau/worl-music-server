import { Document } from 'mongoose';

import { Author } from '../schemas';

export type AuthorDocument = Author & Document;
