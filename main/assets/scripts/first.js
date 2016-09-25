
$(document).ready(function() {
    // console.log('111');
    // alert('here');
    $.ajax({
        url: '/getcourses', //the URL to your node.js server that has data
        dataType: 'json',
        type: "POST",
        cache: false
    }).done(function(json){
        var num = json.length;

        for(var i = 0; i < num; i++){

            var id = json[i].course_id;
            var dept = json[i].dept_code;
            var cnum = json[i].course_number;
            var name = json[i].course_name;

            var $option = $("<option/>",{
                value: id
            });

            $option.append(dept + cnum);

            $("select#courses").append($option);
        }
        // alert(num);
    });
});


