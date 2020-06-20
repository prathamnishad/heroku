const request = require('request');
var express = require("express");
const path = require("path")
app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
var bod;
app.use(express.static("public"));

var url;
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + path.extname(file.originalname);
        url = file.fieldname + '-' + uniqueSuffix;
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

var upload = multer({ storage: storage })

app.get("/", function (req, res) {
    res.render("test.ejs");
});
app.post("/flask_result", function (req, res) {

    url = "http://127.0.0.1:5000/predict?" + "Age=" + req.body.flask["age"] + "&Sex=" + req.body.flask["sex"] + "&Embarked=" + req.body.flask["embarked"].toUpperCase();
    console.log(url);
    request(url, function (error, responce, body) {
        var body = JSON.parse(body);
        bod = body["prediction"];
        res.render("flask_result.ejs", { data: body });
    })
});
app.get("/flask_result", function (req, res) {
    res.render("flask_result.ejs", { data: bod });
});
app.post("/upload", upload.single("image"), function (req, res) {
    console.log(typeof url);
    res.render("images.ejs", { url: url });
});


app.listen(process.env.PORT || 4000, function () {
    console.log("look at server");
});
