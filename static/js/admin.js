// https://www.googleapis.com/youtube/v3/videos?id=m1eWduSmLRE&key=AIzaSyDoIHTruoCcairZfi8oTclOrmM8UGyUkyM&fields=items(snippet(title))&part=snippet

$(document).ready(function(){
    $.ajax({
        type: 'GET',
        url: '/getTop/999999',
        dataType: 'json',
        encode: true
    }).done(function (data){
        $.each(data,function(i,obj){
            var reqData = { 'id': 'm1eWduSmLRE&key=AIzaSyDoIHTruoCcairZfi8oTclOrmM8UGyUkyM',
                            'fields': 'items(snippet(title))',
                            'part=snippet': 'part=snippet'}

            console.log(obj[0].slice(-11));
           
        });
    });
});