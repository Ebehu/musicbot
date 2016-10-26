// https://www.googleapis.com/youtube/v3/videos?id=m1eWduSmLRE&key=AIzaSyDoIHTruoCcairZfi8oTclOrmM8UGyUkyM&fields=items(snippet(title))&part=snippet

var removeRequest = function (id) {
    var remReq = new XMLHttpRequest();
    remReq.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
        }
    };
    remReq.open("GET", "/admin/deleteByID/" + id, true);
    remReq.send();
};

$(document).ready(function(){
    $.ajax({
        type: 'GET',
        url: '/getTop/0',
        dataType: 'json',
        encode: true
    }).done(function (data){
        $.each(data,function(i,obj){
            var id = obj[0].slice(-11);
            var votes = obj[1];
            var reqData = { 
                'key': 'AIzaSyDoIHTruoCcairZfi8oTclOrmM8UGyUkyM',
                'fields': 'items(snippet(title))',
                'part': 'snippet',
                'id': id};
            $.ajax({
                url: 'https://www.googleapis.com/youtube/v3/videos',
                data: reqData,
                dataType: 'json',
                encode: true
            }).done(function(ytData){
                var title = ytData.items[0].snippet.title;
                $('#adminWrapper').append(
                    '<div class="ytSong">' + '<img src="' + 'https://img.youtube.com/vi/'+ id +'/default.jpg" />'+ '<div class="songParams">'   + 
                    '<span class="title">' + title + '</span> <br />' + 
                    '<span class="votes">Votes: ' + votes + '</span> ' + 
                    '</div>' +
                    '<div class="actions">' +
                    /*'<form method="GET" action="/admin/deleteByID/' + id + '">' +
                    '<input type="submit" value="Delete Video"></form>' +*/
                    '<input value="Delete Video" type="button" onClick="removeRequest(\'' + id + '\')"></input>' +
                    '</div>' + 
                    '</div>'
                );
            });           
        });
    });
});