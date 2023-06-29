require('dotenv').config()

const mongoose = require("mongoose");

const url = process.env.MONGODB_URI
console.log(`Connecting to ${url}`);

mongoose.connect(url)
.then(result => {
  console.log('Connected to Art Gallery DB');
})
.catch(error => {
  console.log('Error connecting to Art Gallery DB', error.message);
})

const artistSchema = new mongoose.Schema({
  name: String,
  obras: [{author: String, place: String, likes: Number, description: String, img: String}]
})

artistSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Artists', artistSchema)