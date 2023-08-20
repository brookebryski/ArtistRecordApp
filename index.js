const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const Record = require('./models/record');
const Artist = require('./models/artist');
const types =  ['artist', 'duo', 'group']

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

// record routes

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
    const record = await Record.findById(id).populate('artist', 'name');
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

// artist routes

app.get('/artists', async (req, res) => {
    const artists = await Artist.find({});
    res.render('artists/index', { artists });
})

app.get('/artists/new', (req, res) => {
    res.render('artists/new', { types });
})

app.post('/artists', async (req, res) => {
    const artist = new Artist(req.body);
    await artist.save();
    res.redirect('/artists');
})

app.get('/artists/:id', async (req, res) => {
    const { id } = req.params;
    const artist = await Artist.findById(id).populate('records');
    res.render('artists/show', { artist })
})

app.get('/artists/:id/edit', async (req, res) => {
    const { id } = req.params;
    const artist = await Artist.findById(id);
    res.render('artists/edit', { artist, types })
})

app.put('artists/:id', async (req, res) => {
    const { id } = req.params;
    const artist = await Artist.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/artists/${artist._id}`);
})

app.get('/artists/:id/records/new', (req, res) => {
    const { id } = req.params;
    res.render('records/new', { id, types});
})

app.post('/artists/:id/records', async (req, res) => {
    const { id } = req.params;
    const artist = await Artist.findById(id);
    const { title, description, rating } = req.body;
    const record = new Record({ title, description, rating });
    artist.records.push(record);
    record.artist = artist;
    await artist.save();
    await record.save();
    res.redirect(`/artists/${id}`)
})

app.delete('/artists/:id/', async (req, res) => {
    const { id }= req.params;
    const deletedArtist = await Artist.findByIdAndDelete(id);
    res.redirect('/artists');
})

app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})
