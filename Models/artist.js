const mongoose = require('mongoose');
const { Schema } = mongoose;

const artistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['artist', 'duo', 'group']
    },
    records: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Record'
        }
    ]
     
})

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;