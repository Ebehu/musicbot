var express= require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
mongoose.connect("mongodb://localhost/musicbot2");

var Schema = mongoose.Schema;

var voteSchema = new Schema({
    name: String,
    song: String,
    style: String,

});

var Vote = mongoose.model('Vote',voteSchema);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('static'));

app.get('/getDb',(req,res)=>{
    Vote.find().exec((err,sendVotes)=>{
        if (!err)
            res.send(sendVotes);
    });        
});

app.post('/postVote',(req,res)=>{
    var newVote = new Vote({name: req.body.yourname, song: req.body.yoursong, style: req.body.yourstyle});
    newVote.save((err) => {console.log(err)});
    res.redirect('/');
});

app.listen(3000);