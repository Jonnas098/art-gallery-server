const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Artists = require('./models/artist')

//Middlewares

morgan.token('body', (request) => JSON.stringify(request.body))

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :response-time ms | :res[content-lenght] | :body'))


//Requests

app.get('/', (request, response) => {
  response.send('<h1>/api/artists to see the data</h1>')
})

app.get('/api/artists', (request, response) => {
  Artists.find({}).then(artists => {
    console.log('Done process');
    response.json(artists)
  })
})

app.get('/api/artists/:id', (request, response, next) => {
  Artists.findById(request.params.id).then(artist => {
    if(artist) {
      console.log('Artist found');
      response.json(artist)
      response.status(200).end()
    } else {
      console.log('Artist not found');
      response.send('<h1>404 Artist Not Found</h1>')
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.put('/api/artists/:id', (request, response) => {
  const body = request.body
  const id = request.params.id
  const updatedArtist = {
    nombre: body.nombre,
    obras: body.obras
  }

  Artists.findByIdAndUpdate(id, updatedArtist, {new:true})
  .then(updatedObj => {
    response.json(updatedObj)
  })
  .catch(error => next(error))
})

//Middlewares 

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'Unknown Endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if(error.name === 'CastError') {
    return response.status(404).send({error: 'Malformated Id'})
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server listen on PORT ${PORT}`);
})