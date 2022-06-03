import { Document } from 'mongoose';
import { Track } from '../schemas';

export type TrackDocument = Track & Document;
