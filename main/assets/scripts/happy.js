var $info = $("section#listing")
$(document).ready(function() {
    window.setTimeout(handle(),5000);
});

function handle(){
    // console.log('111');
    // alert('here');
    $info.empty();
    $.ajax({
        url: '/happypost', //the URL to your node.js server that has data
        dataType: 'json',
        type: "POST",
        cache: false
    }).done(function(json){
        var num = json.length;
        // alert(num);
        // console.log(num);
        var $ul = $("<ul/>",{
        }); 
        for(var i = 0; i < num; i++){
            var name = json[i].course_name;
            var $li = $("<li/>",{
            });
            $li.append(name);
            $ul.append($li);
        }
        $("section#info").append($ul);
    });
};


