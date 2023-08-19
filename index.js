const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const Record = require('./models/record');

mongoose.connect('mongodb://localhost:27017/artistRecord', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })
    
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.get('/records', async (req, res) => {
    const records = await Record.find({});
    res.render('records/index', { records });
})

app.get('/records/new', (req, res) => {
    res.render('records/new');
})

app.post('/records', async (req, res) => {
    const record = new Record(req.body);
    await record.save();
    res.redirect('/records');
})

app.get('/records/:id', async (req, res) => {
    const { id } = req.params;
    const record = await Record.findById(id);
    res.render('records/show', { record });
})

app.get('/records/:id/edit', async (req, res) => {
    const { id } = req.params;
    const record = await Record.findById(id);
    res.render('records/edit', { record });
})

app.put('/records/:id', async (req, res) => {
    const { id } = req.params;
    const record = await Record.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/records/${record._id}`)
})

app.delete('/records/:id', async (req, res) => {
    const { id } = req.params;
    const deltedRecord = await Record.findByIdAndDelete(id);
    res.redirect('/records');
})

app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})
