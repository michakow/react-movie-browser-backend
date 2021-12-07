const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

const opinions = []

app.get('/', (req, res) => {
  console.log(req)
  res.send('serwer działa')
})

app.get('/opinions', (req, res) => {
  res.json({opinions})
})

app.post('/opinions', (req, res) => {
  console.log(req.body)
  opinions.push(req.body)
  res.status(200).end()
})

app.delete('/opinions/:opinionID', (req, res) => {
  const id = req.params.opinionID
  const deletedOpinionID = opinions.findIndex(element => element.id === id)
  
  if(deletedOpinionID === -1) res.status(404).end()
  else {
    opinions.splice(deletedOpinionID, 1)
    res.status(200).end()
  }
})

app.listen(8888, () => {
  console.log('aplikacja wystartowała na porcie 8888')
})

