const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())

require('./db/mongoose.js')
const User = require('./db/models/user')

const createUser = async (data) => {
  const checkAvailable = await User.findOne({ name: data.name })
  if(checkAvailable){
    console.log('istnieje user o loginie:', data.name)
    return false
  }else{
    const user = new User(data)
    await user.save()
    console.log('utworzono nowego usera:', data.name)
    return true
  }
}

const authUser = async (data) => {
  const userExist = await User.findOne({ name: data.name })
  if(userExist){
    if(data.password === userExist.password){
      console.log('poprawne logowanie do konta:', data.name)
      return true
    }else{
      console.log('zly login lub haslo do konta:', data.name)
      return false
    }
  }else{
    console.log('zly login lub haslo do konta:', data.name)
    return false
  }
}

const port = process.env.PORT || 8888

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

app.post('/users/create', async (req, res) => {
  const data = {
    ...req.body,
    favMoviesID: [1, 4, 6]
  }
  const userCreated = await createUser(data)
  if(userCreated) res.status(200).send({ code: 1 })
  else res.status(400).send({ code: 0 })
})

app.post('/users/auth', async (req, res) => {
  const authCorrect = await authUser(req.body)
  if(authCorrect) res.status(200).send({ code: 1 })
  else res.status(400).send({ code: 0 })
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

app.listen(port, () => {
  console.log(`aplikacja wystartowała na porcie ${port}`)
})

