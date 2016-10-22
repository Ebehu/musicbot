var express= require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');

var app = express();
mongoose.connect("mongodb://localhost/musicbot6");

var Schema = mongoose.Schema;

var voteSchema = new Schema({
    name: String,
    song: String,
    style: String,
},{
    timestamps: true
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

app.get('/getTop/:howMany',(req,res)=>{
    Vote.find().exec((err,sendVotes)=>{
        var topList = {};
        sendVotes.forEach((val)=>{
            if (topList[val.song] >= 0) {
                topList[val.song]++;
            }
            else{
                topList[val.song] = 1;
            }
        });
        var tuples = [];
        for (let key in topList) tuples.push([key, topList[key]]);
        tuples.sort((a,b)=>{
            a = a[1];
            b = b[1];
            return a < b ? 1 : (a > b ? -1 : 0);
        });
        tuples.splice(req.params.howMany,tuples.length);
        res.send(tuples);
    });
});

app.get('/postTopToFile/:howMany',(req,res)=>{
    
    Vote.find().exec((err,sendVotes)=>{
        var topList = {};
        sendVotes.forEach((val)=>{
            if (topList[val.song] >= 0) {
                topList[val.song]++;
            }
            else{
                topList[val.song] = 1;
            }
        });
        var tuples = [];
        for (let key in topList) tuples.push([key, topList[key]]);
        tuples.sort((a,b)=>{
            a = a[1];
            b = b[1];
            return a < b ? 1 : (a > b ? -1 : 0);
        });
        var titles = tuples.map(x => x[0]);
        titles.splice(req.params.howMany,titles.length);
        var finalString = titles.reduce((acc,cur) => acc+cur + '\n', "");
        fs.writeFile('/home/krisz/MusicBot/config/autoplaylist.txt',finalString, (err) => {
            if (err) res.send(err);
        });
        res.send("done");
    });
});


app.post('/postVote',(req,res)=>{
    var youtubelink = req.body.yoursong.match(/(https?\:\/\/)?(www\.)?youtu(\.be\/|be\.com\/watch\?v\=)[a-zA-Z0-9\_\-]{11}?/gmi);
    if (youtubelink !== null)
    {
        var newVote = new Vote({name: req.body.yourname, song: youtubelink[0], style: req.body.yourstyle});
        newVote.save((err) => {console.log(err)});
        res.redirect('/');
    }
    else {
        res.send('Bad Youtube Link!');
    }

});

app.listen(3000);