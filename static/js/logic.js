/*function voteAjax(message) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) { //OK
            alert("Vote successful! Thanks!");
        } else if (this.readyState == 4 && this.status == 400) {
            alert("Vote is not successful! Reason: " + this.responseText);
        }
    };
    xhttp.open('POST', '/postVote', true);
    xhttp.send();
}*/

$(document).ready(function () {
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