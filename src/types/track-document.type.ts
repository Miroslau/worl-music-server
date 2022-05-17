import { Document } from 'mongoose';
import { Track } from '../schemas/track.schema';

export type TrackDocument = Track & Document;
