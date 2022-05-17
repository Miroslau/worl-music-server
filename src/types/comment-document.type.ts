import { Document } from "mongoose";

import { Comment } from "../schemas/comment.schema";

export type CommentDocument = Comment & Document;
