// Import
const app = require("express")();
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");

// Config
const config = require("./config.js");

function genName() {
  let chars = config.chars;
  let out = [];
  for(let i = 0; i < config.fileLen; i ++, out.push(chars[Math.floor(Math.random() * chars.length)]));
  return out.join("");
}

function createPaste(url) {
  let matches = url.match(/^data:.+\/(.+);base64,(.*)$/);
  let ext = matches[1];
  let data = matches[2];
  let buffer = Buffer.from(data, 'base64');
  let name = genName() + '.' + ext;
  fs.writeFileSync("static/" + name, buffer);
  return name;
}

// Use Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

// Use Multer
let upload = multer({ dest: 'static/' });

// Statics
app.use(require("express").static(__dirname + "/static"));
app.use(require("express").static(__dirname + "/public"));

// Route
app
  .get("/", (_r, res) => res.sendFile(__dirname + "/index.html"))
  .get("/upload", (_r, res) => res.sendFile(__dirname + "/upload.html"))
  .get("/paste", (_r, res) => res.sendFile(__dirname + "/paste.html"))
  .post("/upload_paste", (req, res) => {
    if (!/data:/.test(req.body.url)) {
      res.end("This image is not currently supported");
    }
    let file = createPaste(req.body.url);
    res.send(fs.readFileSync("success.html", "utf8").replace(/\$name/g, file));
  })
  .post("/upload", upload.single('data'), (req, res) => {
    if (!/image/.test(req.file.mimetype)) {
      res.end("AHAHAHAHAHAHA HACKER YOU HAVE BEEN FOILED! YOU THINK YOU CAN HACK ME? THINK AGAIN! ~Navaneeth K M")
      return;
    }
    let ext = req.file.mimetype.split("/")[1];
    let name = genName() + "." + ext;
    fs.renameSync(req.file.path, "static/" + name);
    res.send(fs.readFileSync("success.html", "utf8").replace(/\$name/g, name));
  })
;

// Listen
app.listen(8080);

console.log("localhost:8080")