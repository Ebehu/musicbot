var express = require('express');
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
}, {
    timestamps: true
});

var voterSchema = new Schema({
    ipAddr: String
}, {
    timestamps: true
});

var Vote = mongoose.model('Vote', voteSchema);
var Voter = mongoose.model('Voter', voterSchema);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('static'));

app.get('/getDb', (req, res) => {
    Vote.find().exec((err, sendVotes) => {
        if (!err)
            res.send(sendVotes);
    });
});

app.get('/getTop/:howMany', (req, res) => {
    Vote.find().exec((err, sendVotes) => {
        var topList = {};
        sendVotes.forEach((val) => {
            if (topList[val.song] >= 0) {
                topList[val.song]++;
            } else {
                topList[val.song] = 1;
            }
        });
        var tuples = [];
        for (let key in topList) tuples.push([key, topList[key]]);
        tuples.sort((a, b) => {
            a = a[1];
            b = b[1];
            return a < b ? 1 : (a > b ? -1 : 0);
        });
        tuples.splice(req.params.howMany, tuples.length);
        res.send(tuples);
    });
});
var votesToList = (sendVotes) => {

    var topList = {};
    sendVotes.forEach((val) => {
        if (topList[val.song] >= 0) {
            topList[val.song]++;
        } else {
            topList[val.song] = 1;
        }
    });
    return topList;
}
var listToArray = (list) => {
    var tuples = [];
    for (let key in list) tuples.push([key, list[key]]);
    tuples.sort((a, b) => {
        a = a[1];
        b = b[1];
        return a < b ? 1 : (a > b ? -1 : 0);
    });
    return tuples;
}
app.get('/postTopToFile/:howMany/:password', (req, res) => {
    if (req.params.password == "gbhDAS3!RgŰCIKŐÖ+öaÉ4igq3AQ+!JG") {
        Vote.find().exec((err, sendVotes) => {
            var topList = votesToList(sendVotes);
            var tuples = listToArray(topList);
            var titles = tuples.map(x => x[0]);
            titles.splice(req.params.howMany, titles.length);

            var finalString = titles.reduce((acc, cur) => acc + cur + '\n', "");

            fs.writeFile('/home/krisz/MusicBot/config/autoplaylist.txt', finalString, (err) => {
                if (err) res.send(err);
            });
            res.send("done");
        });
    } else {
        res.send("wrong password");
    }

});

var postVote = (req, res, youtubelink) => {
    var newVote = new Vote({
        name: req.body.yourname,
        song: youtubelink[0],
        style: req.body.yourstyle
    });
    newVote.save((err) => {
        console.log(err)
    });
    res.send({
        'success': true,
        'message': 'Vote Successful!'
    });
};

app.post('/postVote', (req, res) => {

    //Keressen egyet, ha nincs még, adja hozzá
    //különben, ha megvan már akkor nézze meg h 1 napon belül szavazott e.
    // ha 1 napon belül van akk ne engedje újra, különben igen, kivéve ha 192.168.1.1, akkor mindig engedjen szavazni

    var youtubelink = req.body.yoursong.match(/(https?\:\/\/)?(www\.)?youtu(\.be\/|be\.com\/watch\?v\=)[a-zA-Z0-9\_\-]{11}?/gmi);
    if (youtubelink !== null) {
        Voter.findOne({
            ipAddr: req.connection.remoteAddress
        }, function (err, voter) {
            if (!err) {
                if (!voter) {
                    var newVoter = new Voter({
                        ipAddr: req.connection.remoteAddress
                    }); //not known
                    newVoter.save();
                    postVote(req, res, youtubelink);
                } else { //known
                    var updatedDate = new Date(voter.updatedAt);
                    updatedDate.setTime(updatedDate.getTime() + 60 * 60 * 1000);
                    console.log(updatedDate);
                    if (true || updatedDate < new Date()) {
                        voter.updatedAt = new Date();
                        voter.save();
                        postVote(req, res, youtubelink);
                    } else {
                        res.send({
                            'success': false,
                            'message': "You have already voted in an hour. You can vote again at " + updatedDate.getFullYear() + ". " +
                                (updatedDate.getMonth() + 1) + ". " +
                                updatedDate.getDate() + ". " +
                                updatedDate.getHours() + ":" + updatedDate.getMinutes() + ":" + updatedDate.getSeconds()
                        });
                    }
                }
            }
        });
    } else {
        res.send({
            'success': false,
            'message': 'Bad Youtube Link!'
        });
    }



});


app.get('/napi1Teszt', (req, res) => {

});

app.get('/voters', (req, res) => {
    Voter.find().exec((err, sendVoters) => {
        res.send(sendVoters);
    });
});

app.listen(3000);