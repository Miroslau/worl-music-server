import mongoose from "mongoose";

export const getAllAuthors = () => {
    return [
        {
            '$unwind': {
                'path': '$tracks',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$lookup': {
                'from': 'tracks',
                'localField': 'tracks',
                'foreignField': '_id',
                'as': 'tracks'
            }
        }, {
            '$unwind': {
                'path': '$tracks',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$project': {
                '_id': '$_id',
                'name': '$name',
                'album': '$album',
                'tracks': {
                    '_id': '$tracks._id',
                    'name': '$tracks.name',
                    'listens': '$tracks.listens',
                    'picture': '$tracks.picture',
                    'audio': '$tracks.audio',
                    'comments': '$tracks.comments'
                }
            }
        }, {
            '$group': {
                '_id': '$_id',
                'name': {
                    '$first': '$name'
                },
                'tracks': {
                    '$push': '$tracks'
                },
                'album': {
                    '$first': '$album'
                }
            }
        }, {
            '$lookup': {
                'from': 'albums',
                'localField': 'album',
                'foreignField': '_id',
                'as': 'album'
            }
        }
    ]
}

export const getAuthorById = (id: string) => {
    return [
        {
            '$match': {
                '_id': new mongoose.Types.ObjectId(id)
            }
        }, {
            '$unwind': {
                'path': '$tracks'
            }
        }, {
            '$lookup': {
                'from': 'tracks',
                'localField': 'tracks',
                'foreignField': '_id',
                'as': 'tracks'
            }
        }, {
            '$unwind': {
                'path': '$tracks'
            }
        }, {
            '$project': {
                '_id': '$_id',
                'name': '$name',
                'album': '$album',
                'tracks': {
                    '_id': '$tracks._id',
                    'name': '$tracks.name',
                    'listens': '$tracks.listens',
                    'picture': '$tracks.picture',
                    'audio': '$tracks.audio',
                    'comments': '$tracks.comments'
                }
            }
        }, {
            '$group': {
                '_id': '$_id',
                'name': {
                    '$first': '$name'
                },
                'tracks': {
                    '$push': '$tracks'
                },
                'album': {
                    '$first': '$album'
                }
            }
        }, {
            '$lookup': {
                'from': 'albums',
                'localField': 'album',
                'foreignField': '_id',
                'as': 'album'
            }
        }
    ];
}

export const searchAuthor = (query: string) => {
    return [
        {
            '$match': {
                'name': {
                    '$regex': query,
                    '$options': 'i'
                }
            }
        }, {
            '$unwind': {
                'path': '$tracks',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$lookup': {
                'from': 'tracks',
                'localField': 'tracks',
                'foreignField': '_id',
                'as': 'tracks'
            }
        }, {
            '$unwind': {
                'path': '$tracks',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$project': {
                '_id': '$_id',
                'name': '$name',
                'album': '$album',
                'tracks': {
                    '_id': '$tracks._id',
                    'name': '$tracks.name',
                    'listens': '$tracks.listens',
                    'picture': '$tracks.picture',
                    'audio': '$tracks.audio',
                    'comments': '$tracks.comments'
                }
            }
        }, {
            '$group': {
                '_id': '$_id',
                'name': {
                    '$first': '$name'
                },
                'tracks': {
                    '$push': '$tracks'
                },
                'album': {
                    '$first': '$album'
                }
            }
        }, {
            '$lookup': {
                'from': 'albums',
                'localField': 'album',
                'foreignField': '_id',
                'as': 'album'
            }
        }
    ]
}

