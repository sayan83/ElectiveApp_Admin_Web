const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const {electiveNames,subjectNames,subjectDetails,addNewSubject,assignElectives} = require('./controllers/electives.js')
const {getAssignedData} = require('./controllers/downloadCSV');
const {adminLogin, sendOTP, resetPassword, verifyToken } = require('./controllers/auth');


dotenv.config();


app.use(cors("*"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/index.html'));
});


app.get('/home', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/adminHome.html'));
});

app.post('/electiveNames', function(req,res) {
    electiveNames(req,res);
});

app.post('/subjectNames', function(req,res) {
    subjectNames(req,res);
});

app.post('/subjectDetails', function(req,res) {
    subjectDetails(req,res);
});

app.post('/addNewSubject', function(req,res) {
    addNewSubject(req,res);
});

app.post('/assignElectives', function(req,res) {
    assignElectives(req,res);
});

app.post('/getCSV', function(req,res) {
    getAssignedData(req,res);
});

app.get('/download/:filename', function(req,res) {
    res.download(__dirname+`/${req.params.filename}`);
});

app.post('/adminLogin', function(req,res) {
    adminLogin(req,res);
});

app.get('/sendOTP', function(req,res) {
    sendOTP(req,res);
});

app.post('/resetPassword', function(req,res) {
    resetPassword(req,res);
});

app.post('/verifyTokens', function(req,res) {
    verifyToken(req,res);
})

app.listen(process.env.PORT, () => {console.log("Listening on port 3000")});