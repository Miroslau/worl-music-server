import { Document } from 'mongoose';

import { Comment } from '../schemas';

export type CommentDocument = Comment & Document;
