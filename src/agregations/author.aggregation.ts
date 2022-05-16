export const getAllAuthors = () => {
    return [
        {
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
                }
            }
        }
    ];
}
