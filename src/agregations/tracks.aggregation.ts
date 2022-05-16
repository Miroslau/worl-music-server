import mongoose from "mongoose";

export const getAllTracks = () => {
    return [
        {
            '$lookup': {
                'from': 'albums',
                'localField': 'album',
                'foreignField': '_id',
                'as': 'album'
            }
        }, {
            '$unwind': {
                'path': '$album',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$project': {
                '_id': '$_id',
                'name': '$name',
                'artist': '$artist',
                'picture': '$picture',
                'audio': '$audio',
                'comments': '$comments',
                'album': {
                    '_id': '$album._id',
                    'name': '$album.name',
                    'picture': '$album.picture'
                }
            }
        }, {
            '$unwind': {
                'path': '$artist',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$lookup': {
                'from': 'authors',
                'localField': 'artist',
                'foreignField': '_id',
                'as': 'artist'
            }
        }, {
            '$unwind': {
                'path': '$artist',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$project': {
                '_id': '$_id',
                'name': '$name',
                'artist': {
                    '_id': '$artist._id',
                    'name': '$artist.name'
                },
                'picture': '$picture',
                'audio': '$audio',
                'comments': '$comments',
                'album': '$album'
            }
        }, {
            '$group': {
                '_id': '$_id',
                'name': {
                    '$first': '$name'
                },
                'picture': {
                    '$first': '$picture'
                },
                'audio': {
                    '$first': '$audio'
                },
                'album': {
                    '$first': '$album'
                },
                'artist': {
                    '$push': '$artist'
                }
            }
        }
    ];
}

export const getTrackById = (id: string) => {
    return [
        {
            '$match': {
                '_id': new mongoose.Types.ObjectId(id)
            }
        }, {
            '$lookup': {
                'from': 'albums',
                'localField': 'album',
                'foreignField': '_id',
                'as': 'album'
            }
        }, {
            '$unwind': {
                'path': '$album',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$project': {
                '_id': '$_id',
                'name': '$name',
                'artist': '$artist',
                'picture': '$picture',
                'audio': '$audio',
                'comments': '$comments',
                'album': {
                    '_id': '$album._id',
                    'name': '$album.name',
                    'picture': '$album.picture'
                }
            }
        }, {
            '$unwind': {
                'path': '$artist',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$lookup': {
                'from': 'authors',
                'localField': 'artist',
                'foreignField': '_id',
                'as': 'artist'
            }
        }, {
            '$unwind': {
                'path': '$artist',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$project': {
                '_id': '$_id',
                'name': '$name',
                'artist': {
                    '_id': '$artist._id',
                    'name': '$artist.name'
                },
                'picture': '$picture',
                'audio': '$audio',
                'comments': '$comments',
                'album': '$album'
            }
        }, {
            '$group': {
                '_id': '$_id',
                'name': {
                    '$first': '$name'
                },
                'picture': {
                    '$first': '$picture'
                },
                'audio': {
                    '$first': '$audio'
                },
                'album': {
                    '$first': '$album'
                },
                'artist': {
                    '$push': '$artist'
                }
            }
        }
    ]
}

export const searchTrack = (query: string) => {
    return [
        {
            '$match': {
                'name': {
                    '$regex': query,
                    '$options': 'i'
                }
            }
        }, {
            '$lookup': {
                'from': 'albums',
                'localField': 'album',
                'foreignField': '_id',
                'as': 'album'
            }
        }, {
            '$unwind': {
                'path': '$album',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$project': {
                '_id': '$_id',
                'name': '$name',
                'artist': '$artist',
                'picture': '$picture',
                'audio': '$audio',
                'comments': '$comments',
                'album': {
                    '_id': '$album._id',
                    'name': '$album.name',
                    'picture': '$album.picture'
                }
            }
        }, {
            '$unwind': {
                'path': '$artist',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$lookup': {
                'from': 'authors',
                'localField': 'artist',
                'foreignField': '_id',
                'as': 'artist'
            }
        }, {
            '$unwind': {
                'path': '$artist',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$project': {
                '_id': '$_id',
                'name': '$name',
                'artist': {
                    '_id': '$artist._id',
                    'name': '$artist.name'
                },
                'picture': '$picture',
                'audio': '$audio',
                'comments': '$comments',
                'album': '$album'
            }
        }, {
            '$group': {
                '_id': '$_id',
                'name': {
                    '$first': '$name'
                },
                'picture': {
                    '$first': '$picture'
                },
                'audio': {
                    '$first': '$audio'
                },
                'album': {
                    '$first': '$album'
                },
                'artist': {
                    '$push': '$artist'
                }
            }
        }
    ]
}
