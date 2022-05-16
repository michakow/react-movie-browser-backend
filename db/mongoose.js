const mongoose = require("mongoose");
//const dburl = require("../configdb.js");

const url = process.env.DATABASE_URL; //|| dburl;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("polaczono z db"))
  .catch(() => console.log("nie udalo sie polaczyc z db"));
