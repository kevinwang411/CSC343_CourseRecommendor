
$(document).ready(function() {
    // console.log('111');
    // alert('here');
    $.ajax({
        url: '/gettopicsdept', //the URL to your node.js server that has data
        dataType: 'json',
        type: "POST",
        cache: false
    }).done(function(json){
        var num = json.length;
        // alert(num);
        var depts = [];
        for(var i = 0; i < num; i++){
            var dept = json[i].dept_code;
            if (depts.indexOf(dept) == -1 ){
                depts.push(dept);
                var $section = $("<section/>",{
                    class: 'formsec',
                    id: dept
                });
                $section.append("<h4> Department Code: " + dept + "</h4>");
                $("form#interestform").append($section);
            }
        }
        for(var i = 0; i < num; i++){
            var id = json[i].topic_id;
            var dept = json[i].dept_code;
            var name = json[i].topic;
            var $option0 = $("<option/>",{});
            $option0.attr("disabled");
            $option0.append('-- select an option --');
            var $option1 = $("<option/>",{
                value: 1
            });
            $option1.append('1');
            var $option2 = $("<option/>",{
                value: 2
            });
            $option2.append('2');
            var $option3 = $("<option/>",{
                value: 3
            });
            $option3.append('3');
            var $option4 = $("<option/>",{
                value: 4
            });
            $option4.append('4');
            var $option5 = $("<option/>",{
                value: 5
            });
            $option5.append('5');

            var $label = $("<label/>",{
                for: id
            });
            $label.append(name);
            var $select = $("<select/>",{
                name: id,
                id: id
            });

            $select.append($option0);
            $select.append($option1); 
            $select.append($option2); 
            $select.append($option3); 
            $select.append($option4); 
            $select.append($option5);  
            var $div = $("<div/>",{});
            $div.append($label);
            $div.append("<br>");
            $div.append($select);
            $("section#" + dept).append($div);
        }    
        var $button = $("<button/>",{
            type: 'submit'
        });
        $button.append('Submit');
        $("form#interestform").append($button);

    });
});


