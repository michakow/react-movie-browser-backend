const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://userop:userop@cluster0.zqmge.mongodb.net/react-movie-browser-db?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('polaczono z db')).catch(() => console.log('nie udalo sie polaczyc z db'))

