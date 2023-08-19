const mongoose = require('mongoose');
const { Schema } = mongoose;


    const recordSchema = new Schema({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        }
    })

    const Record = mongoose.model('Record', recordSchema);

    module.exports = Record;