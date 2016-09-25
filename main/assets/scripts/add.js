
$(document).ready(function() {
    // console.log('111');
    // alert('here');
    $.ajax({
        url: '/addinfo', //the URL to your node.js server that has data
        dataType: 'json',
        type: "POST",
        cache: false
    }).done(function(json){
        var courses = json[0];
        var num = courses.length;
        // console.log(courses);
        var $div = $("<div/>",{});
        var $select = $("<select/>",{
            name: 'courses',
            id: 'courses'
        });
        var $label = $("<label/>",{});
        $label.append('Course:  ');
        $div.append($label);
        $div.append('<br>');
        for(var i = 0; i < num; i++){
            var $option = $("<option/>",{
                value: courses[i].edition_id
            });
            $option.append(courses[i].dept_code + courses[i].course_number + 
                ', Semester: ' + courses[i].semester + ', Year: ' + 
                courses[i].year + ', Time: ' + courses[i].time_day + ', Students: ' + courses[i].total_students);
            $select.append($option);
        }
        $div.append($select);
        $("form#interestform").append($div); 
        $("form#interestform").append("<br>"); 

        var grades = ['A+', 'A', 'A-', 'B+', 'B',  'B-','C+', 'C', 'C-', 'D+', 'D-', 'D', 'F'];
        var $div1 = $("<div/>",{})
        var $label1 = $("<label/>",{});
        $label1.append('Letter Grade:  ');
        $div1.append($label1);
        $div1.append('<br>');
        var $select1 = $("<select/>",{
            name: 'grade',
            id: 'grade'
        });
        for (var i = 0; i < grades.length; i++){
            var $option1 = $("<option/>",{
                value: grades[i]
            });
            $option1.append(grades[i]);
            $select1.append($option1);
        }
        $div1.append($select1);
        $("form#interestform").append($div1);
        $("form#interestform").append("<br>");

        var ranks = ['1','2','3','4','5'];
        var $div2 = $("<div/>",{})
        var $label2 = $("<label/>",{});
        $label2.append('Course Ranking:  ');
        $div2.append($label2);
        $div2.append('<br>');
        var $select2 = $("<select/>",{
            name: 'courserank',
            id: 'courserank'
        });
        for (var i = 0; i < ranks.length; i++){
            var $option2 = $("<option/>",{
                value: ranks[i]
            });
            $option2.append(ranks[i]);
            $select2.append($option2);
        }
        $div2.append($select2);
        $("form#interestform").append($div2);
        $("form#interestform").append("<br>");

        var ranks = ['1','2','3','4','5'];
        var $div2 = $("<div/>",{})
        var $label2 = $("<label/>",{});
        $label2.append('Instructor Ranking:  ');
        $div2.append($label2);
        $div2.append('<br>');
        var $select2 = $("<select/>",{
            name: 'insrank',
            id: 'insrank'
        });
        for (var i = 0; i < ranks.length; i++){
            var $option2 = $("<option/>",{
                value: ranks[i]
            });
            $option2.append(ranks[i]);
            $select2.append($option2);
        }
        $div2.append($select2);
        $("form#interestform").append($div2);
        $("form#interestform").append("<br>");

        var $div2 = $("<div/>",{})
        var $label2 = $("<label/>",{});
        $label2.append('Skill name:  ');
        $div2.append($label2);
        $div2.append('<br>');
        var skills = json[1];
        var num = skills.length;
        // console.log(courses);
        var $select = $("<select/>",{
            name: 'skill',
            id: 'skill'
        });
        var $option = $("<option/>",{
            value: '-- select an option --'
        });
        $option.append('-- select an option --');
        $select.append($option);
        for(var i = 0; i < num; i++){
            var $option = $("<option/>",{
                value: skills[i].skill_id
            });
            $option.append(skills[i].skill);
            $select.append($option);
        }
        $div2.append($select);
        $("form#interestform").append($div2); 

        var $div2 = $("<div/>",{})
        var $label2 = $("<label/>",{});
        $label2.append('Rank before:  ');
        $div2.append($label2);
        $div2.append('<br>');
        var $select2 = $("<select/>",{
            name: 'rbefore',
            id: 'rbefore'
        });
        for (var i = 0; i < ranks.length; i++){
            var $option2 = $("<option/>",{
                value: ranks[i]
            });
            $option2.append(ranks[i]);
            $select2.append($option2);
        }
        $div2.append($select2);
        $("form#interestform").append($div2); 

        var $div2 = $("<div/>",{})
        var $label2 = $("<label/>",{});
        $label2.append('Rank after:  ');
        $div2.append($label2);
        $div2.append('<br>');
        var $select2 = $("<select/>",{
            name: 'rafter',
            id: 'rafter'
        });
        for (var i = 0; i < ranks.length; i++){
            var $option2 = $("<option/>",{
                value: ranks[i]
            });
            $option2.append(ranks[i]);
            $select2.append($option2);
        }
        $div2.append($select2);
        $("form#interestform").append($div2); 
        $("form#interestform").append("<br>");

        var $div2 = $("<div/>",{})
        var $label2 = $("<label/>",{});
        $label2.append('Topic name:  ');
        $div2.append($label2);
        $div2.append('<br>');
        var skills = json[2];
        var num = skills.length;
        // console.log(courses);
        var $select = $("<select/>",{
            name: 'topic',
            id: 'topic'
        });
        var $option = $("<option/>",{
            value: '-- select an option --'
        });
        $option.append('-- select an option --');
        $select.append($option);
        for(var i = 0; i < num; i++){
            var $option = $("<option/>",{
                value: skills[i].topic_id
            });
            $option.append(skills[i].topic);
            $select.append($option);
        }
        $div2.append($select);
        $("form#interestform").append($div2); 

        var $div2 = $("<div/>",{})
        var $label2 = $("<label/>",{});
        $label2.append('Interest before:  ');
        $div2.append($label2);
        $div2.append('<br>');
        var $select2 = $("<select/>",{
            name: 'ibefore',
            id: 'ibefore'
        });
        for (var i = 0; i < ranks.length; i++){
            var $option2 = $("<option/>",{
                value: ranks[i]
            });
            $option2.append(ranks[i]);
            $select2.append($option2);
        }
        $div2.append($select2);
        $("form#interestform").append($div2); 

        var $div2 = $("<div/>",{})
        var $label2 = $("<label/>",{});
        $label2.append('Interest after:  ');
        $div2.append($label2);
        $div2.append('<br>');
        var $select2 = $("<select/>",{
            name: 'iafter',
            id: 'iafter'
        });
        for (var i = 0; i < ranks.length; i++){
            var $option2 = $("<option/>",{
                value: ranks[i]
            });
            $option2.append(ranks[i]);
            $select2.append($option2);
        }
        $div2.append($select2);
        $("form#interestform").append($div2); 
        $("form#interestform").append("<br>");

        $("form#interestform").append('<br><br>'); 
        var $button = $("<button/>",{
            type: 'submit'
        });
        $button.append('Submit');
        $("form#interestform").append($button);

    });
});


