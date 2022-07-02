const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

app.use(cors());
app.use(express.json());

require("./db/mongoose.js");
const User = require("./db/models/user");
const Opinion = require("./db/models/opinion");
//const dbtoken = require("./configtoken.js");

const ObjectId = require("mongoose").Types.ObjectId;

const port = process.env.PORT || 8888;
const accessToken = process.env.ACCESS_TOKEN; //|| dbtoken;

const isValidObjectID = (id) => {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true;
    else return false;
  } else return false;
};

const activeUser = async (req, res) => {
  // if (!isValidObjectID(req.body.userID))
  //   return res.status(400).send({ code: 0 });

  const userExist = await Users.findOne({ name: req.body.userName });
  if (userExist) {
    await Users.findOneAndUpdate(
      { name: req.body.userName },
      { isActive: true }
    );
    res.status(200).send({ code: 1 });
  } else res.status(400).send({ code: 0 });
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

const verifyEmail = ({ _id, email }) => {
  const url = "https://michakow.github.io/react-movie-browser/";
  const mailOption = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Email verification",
    html: `<p>Verify your email to complete the signup.</p><p>Click <a href=${
      url + "verify/" + _id
    }>here</a>.</p>`,
  };
  transporter.sendMail(mailOption);
};

app.listen(port, () => {
  console.log(`aplikacja wystartowała na porcie ${port}`);
});

app.get("/", (req, res) => {
  console.log(req);
  res.send("serwer działa");
});

//User
const createUser = async (data) => {
  const checkAvailable = await User.findOne({ name: data.name });
  if (checkAvailable) {
    console.log("istnieje user o loginie:", data.name);
    return false;
  } else {
    const userData = {
      ...data,
      isActive: false,
    };
    const user = new User(userData);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save().then((result) => verifyEmail(result));
    console.log("utworzono nowego usera:", userData.name);
    return true;
  }
};

const authUser = async (data) => {
  const userExist = await User.findOne({ name: data.name });
  if (userExist) {
    const passwordValidation = await bcrypt.compare(
      data.password,
      userExist.password
    );
    if (passwordValidation && userExist.isActive) {
      console.log("poprawne logowanie do konta:", data.name);
      return true;
    } else {
      console.log("zly login lub haslo do konta:", data.name);
      return false;
    }
  } else {
    console.log("zly login lub haslo do konta:", data.name);
    return false;
  }
};

app.post("/users/create", async (req, res) => {
  console.log(req.body);
  const data = {
    ...req.body,
  };
  const userCreated = await createUser(data);
  if (userCreated) res.status(200).send({ code: 1 });
  else res.status(400).send({ code: 0 });
});

app.post("/users/auth", async (req, res) => {
  const authCorrect = await authUser(req.body);
  if (authCorrect) {
    const token = jwt.sign(req.body.name, accessToken);
    res.status(200).send({ code: 1, token });
  } else res.status(400).send({ code: 0 });
});

app.post("/users/verify", activeUser);

//Opinion
const addOpinion = async (data) => {
  const opinion = new Opinion(data);
  await opinion.save();
  console.log("dodano opinie:", data.text);
  console.log("autor:", data.author);
};

app.get("/opinions", async (req, res) => {
  const opinions = await Opinion.find({});
  res.json({ opinions });
});

app.post("/opinions", (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(400).send({ code: 0 });
  jwt.verify(token, accessToken, (error, reqdata) => {
    if (error) return res.status(400).send({ code: 0 });

    const data = {
      ...req.body,
    };
    addOpinion(data);
    res.status(200).send({ code: 1 });
  });
});

app.delete("/opinions/:opinionID", async (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.opinionID);
  const opinionToDelete = await Opinion.findOne({ _id: id });
  if (opinionToDelete) {
    await Opinion.deleteOne({ _id: id });
    console.log("usunieto opinie:", opinionToDelete);
    res.status(200).send({ code: 1 });
  } else {
    console.log("nie znaleziono takiej opiniii");
    res.status(400).send({ code: 0 });
  }
});
