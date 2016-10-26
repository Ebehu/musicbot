$(document).ready(function () {
    top6Pic();
    $('.alert').hide();
    $('form').submit(function (event) {
        var formData = {
            'yourname': $('input[name=yourname]').val(),
            'yoursong': $('input[name=yoursong]').val(),
            'yourstyle': $('input[name=yourstyle]').val()
        };
        $.ajax({
            type: 'POST',
            url: '/postVote',
            data: formData,
            dataType: 'json',
            encode: true
        }).done(function (data) {
            if(data.success){
                $('#successAlert').show();
                $('#successAlert .messageText').text(data.message);
                //alert(data.message); //sikerült
            } else{
                $('#dangerAlert').show();
                $('#dangerAlert .messageText').text(data.message);
                //alert(data.message); //nem sikerült
            }
                
        });

        event.preventDefault();
    });

    
});

var top6Pic = function() {
    var top6 = document.getElementsByClassName('circular_listFirst');
    $.ajax({
        url: '/getTop/6',
        dataType: 'json',
        encode: true
    }).done(function(data){
        data.forEach(function(value, index){
            top6[index].href = value;
            top6[index].children[0].style.background='url(https://img.youtube.com/vi/'+ value[0].slice(-11) +'/mqdefault.jpg)';
            top6[index].children[0].style.backgroundSize = 'cover';
            top6[index].children[0].style.backgroundPosition='center';
        });
    });
   // $('.circular_listFirst').css("background", 'url()');

}