import mongoose from 'mongoose';

export const getAllAlbums = () => {
    return [
        {
            '$lookup': {
                'from': 'authors',
                'localField': 'author',
                'foreignField': '_id',
                'as': 'author'
            }
        }, {
            '$unwind': {
                'path': '$author'
            }
        }, {
            '$project': {
                '_id': '$_id',
                'name': '$name',
                'author': {
                    '_id': '$author._id',
                    'name': '$author.name'
                },
                'picture': '$picture',
                'tracks': '$tracks'
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
            '$group': {
                '_id': '$_id',
                'name': {
                    '$first': '$name'
                },
                'author': {
                    '$first': '$author'
                },
                'tracks': {
                    '$push': '$tracks'
                }
            }
        }
    ];
}

export const getAlbumById = (id: string) => {
    return [
        {
            '$match': {
                '_id': new mongoose.Types.ObjectId(id)
            }
        }, {
            '$lookup': {
                'from': 'authors',
                'localField': 'author',
                'foreignField': '_id',
                'as': 'author'
            }
        }, {
            '$unwind': {
                'path': '$author'
            }
        }, {
            '$project': {
                '_id': '$_id',
                'name': '$name',
                'author': {
                    '_id': '$author._id',
                    'name': '$author.name'
                },
                'picture': '$picture',
                'tracks': '$tracks'
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
            '$group': {
                '_id': '$_id',
                'name': {
                    '$first': '$name'
                },
                'author': {
                    '$first': '$author'
                },
                'tracks': {
                    '$push': '$tracks'
                }
            }
        }
    ];
}
