var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var bcrypt = require('bcryptjs');
var path = require('path');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var session = require('express-session');
var Handlebars = require('handlebars');
var Sequelize = require('sequelize');



//***********Load database
var db = new sqlite3.Database('db.sqlite');
db.serialize();


//***********Load express
var app = express();
nunjucks.configure('views', {
    autoescape: true,
    express: app
});


//**********Get database
app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(session({secret: 'I am actually a potato',
                 resave: false,
                 saveUninitialized: false
}));
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});



//***********Load html
app.get('/', function (req, res) {
    res.redirect('/login');
});

app.get('/login', is_loggedout, function(req, res) {
    res.render('login.html');
});

app.get('/signup', is_loggedout, function(req, res) {
    res.render('signup.html');
});

var firsttime = 1;

app.get('/dashboard', function(req, res) {
	// username = 'auser1';
	if (firsttime == 1){
		if (insertskills == ''){
			setinsert();
		}
		console.log(courses);
		console.log(interests);
		console.log(skills);
	    getuserinfo();
		getpercentmale();
		getavgage();
		get_alls(function(err) {
			if (err) {
				console.log(err);
		      	res.render('dashboard.html', {error: err});
		    } else {
		    	console.log('GOOD');
		    	res.render('dashboard.html');
		    }
		});
		firsttime = 0;
	} else {
		res.render('dashboard.html');
	}

});

app.get('/grade', function(req, res) {
	res.render('grade.html');
});

app.get('/happy', function(req, res) {
	res.render('happy.html');
});

app.get('/interest1', function(req, res) {
    res.render('interest1.html');
});

app.get('/skill1', function(req, res) {
    res.render('skill1.html');
});


app.get('/interest', function(req, res) {
    res.render('interest.html');
});

app.get('/skill', function(req, res) {
    res.render('skill.html');
});

app.get('/add', function(req, res) {
    res.render('add.html');
});

app.get('/first', is_loggedin, function(req, res) {
    res.render('first.html');
});


app.get('/logout', is_loggedin, function(req, res) {
	firsttime = 1;
    delete req.session.username;
    res.redirect('/login');
});



app.post('/getcourses', function(req, res) {

    db.all('SELECT * FROM courses', function (error, rows) {
    	// console.log(rows);
        res.send(rows);
    });
});


app.post('/addinfo', function(req, res) {
	var coursestr=courses[0];
	var alls = [];
	for (var i=1; i < courses.length ;i++){
		coursestr += ', ';
		coursestr += courses[i];
	}
	db.all('SELECT * FROM courses, course_editions WHERE courses.course_id = course_editions.course_id AND courses.course_id in (' + coursestr + ');', function (error, rows) {
    	// console.log(rows);
    	db.all('SELECT * FROM skills;', function (error, rows1) {
    		// console.log(rows);
    		db.all('SELECT * FROM topics;', function (error, rows2) {
    		// console.log(rows);
    			alls[0] = rows;
    			alls[1] = rows1;
    			alls[2] = rows2;
    			// console.log(alls);
        		res.send(alls);
   			});
   		});
    });
});

app.post('/add', function(req, res) {

	console.log(req.body);
	var edition = req.body.courses;
	var grade = req.body.grade;
	var courserank = req.body.courserank;
	var insrank = req.body.insrank;
	var skill = req.body.skill;
	var rank_before = req.body.rbefore;
	var rank_after = req.body.rafter;
	var topic = req.body.topic;
	var interest_before = req.body.ibefore;
	var interest_after = req.body.iafter;
	add_info(edition, grade, courserank, insrank, skill, rank_before, rank_after, topic, interest_before, interest_after,  function(err, username) {
		if (err) {
			console.log(err);
	      	res.render('add.html', {error: err});
	    } else {
	     	// This way subsequent requests will know the user is logged in.
	     	// console.log('good2');
	      	res.redirect('/dashboard');  
	    }
	});
});


function add_info(edition, grade, courserank, insrank, skill, rank_before, rank_after, topic, interest_before, interest_after, callback) {
	db.all('SELECT course_id FROM course_editions WHERE edition_id = ' + edition + ';', function(err, rows) {
		var cid = rows[0].course_id;
	    db.run('INSERT INTO enrollments(edition_id, username, letter_grade ,course_ranking, instr_ranking) VALUES (?, ?, ?, ?, ?);', 
	    	[edition, username, grade, courserank, insrank], function(err) {
	    		if (skill != '-- select an option --'){
	    			db.run('INSERT INTO skill_rankings(course_id,edition_id,username,skill_id,rank_before,rank_after) VALUES (?, ?, ?, ?, ?, ?);', 
	    				[edition, cid, username, skill, rank_before, rank_after], function(err) {

	    			});
	    		}
	    		if (topic != '-- select an option --'){
	    			db.run('INSERT INTO topic_interests(course_id,edition_id,username,topic_id,interest_before,interest_after) VALUES (?, ?, ?, ?, ?, ?);', 
	    				[edition, cid, username, topic, interest_before, interest_after], function(err) {
	    				
	    			});
	    		}
	        	callback(err, username);
	    });
    });
}


app.post('/first', function(req, res) {
	courses = [];
    var post = req.body;
    if (post.courses){
    	if (Object.prototype.toString.call(post.courses) === '[object Array]'){
    		courses = post.courses;
    	} else{
    		courses = [post.courses];    		
    	}
    }
	console.log(courses);
	res.redirect('/interest1');
});

app.post('/gettopicsdept', function(req, res) {
    db.all('SELECT distinct Topics.topic_id, Topics.topic, Courses.dept_code FROM Topics, Course_topics, Courses WHERE Topics.topic_id = Course_topics.topic_id and Course_topics.course_id = Courses.course_id ;'
    	, function (error, rows) {
    	// console.log(rows);
        res.send(rows);
    });
});


app.post('/interest1', function(req, res) {
	interests = {}
    var post = req.body;
    for (var key in post) {
    	if (Object.prototype.toString.call(post[key]) === '[object Array]' ){
    		for(var i = 0; i < post[key].length; i++){
    			if (post[key][i] != "-- select an option --"){
    				// console.log(post.key[i]);
    				interests[key] = post[key][i];
    			}
    		}
    	} else {
			if (post[key] != "-- select an option --"){
				// console.log(post.key);
    			interests[key] = post[key];
    		}
    	}
		// console.log(key);
		// console.log(post[key]);
	}
	console.log(interests);
	check_interest(function(err) {
		if (err) {
			console.log(err);
	      	res.render('interest1.html', {error: err});
	    } else {
	      	res.redirect('/skill1');  
	    }
	});
});

function check_interest(callback) {
    if(Object.keys(interests).length < 5) {
        callback('Rate at least 5 topics');
    } else{
    	callback();
    }
}

app.post('/getskillsdept', function(req, res) {
    db.all('SELECT distinct Skills.skill_id, Skills.skill, Courses.dept_code FROM Skills, Course_skills, Courses WHERE Skills.skill_id = Course_skills.skill_id and Course_skills.course_id = Courses.course_id ;'
    	, function (error, rows) {
    	// console.log(rows);
        res.send(rows);
    });
});

app.post('/skill1', function(req, res) {
	skills = {}
    var post = req.body;
    for (var key in post) {
    	if (Object.prototype.toString.call(post[key]) === '[object Array]' ){
    		for(var i = 0; i < post[key].length; i++){
    			if (post[key][i] != "-- select an option --"){
    				// console.log(post.key[i]);
    				skills[key] = post[key][i];
    			}
    		}
    	} else {
			if (post[key] != "-- select an option --"){
				// console.log(post.key);
    			skills[key] = post[key];
    		}
    	}
		// console.log(key);
		// console.log(post[key]);
	}
	console.log(skills);
	check_skill(function(err) {
		if (err) {
			console.log(err);
	      	res.render('skill1.html', {error: err});
	    } else {
	      	res.redirect('/dashboard');  
	    }
	});
});

function check_skill(callback) {
    if(Object.keys(skills).length < 5) {
        callback('Rate at least 5 skills');
    } else {
    	callback();    	
	}
}



app.post('/gradepost', function(req, res) {
	setTimeout(handlegp(req, res),200000);
});

function handlegp(req, res){
	db.all('SELECT course_name, avg(grade) FROM possiblecourses GROUP BY course_id ORDER BY avg(grade) DESC LIMIT 5;'
    	, function (error, rows) {
    	console.log('~~~~~~~~~~~~~~~~~~');
    	console.log(rows);
        res.send(rows);
    });
}

app.post('/skillpost', function(req, res) {
	setTimeout(handlesp(req, res),200000);
});

function handlesp(req, res){
	db.run('DROP VIEW IF EXISTS skillcourses;', function(err) {
		if (err){
			callback(err);
		}
		db.all('CREATE VIEW skillcourses AS SELECT distinct possiblecourses.course_name, possiblecourses.username as username, skill_id, (rank_after-rank_before) as rank_diff FROM possiblecourses, skill_rankings ' +
			'WHERE skill_rankings.username = possiblecourses.username AND skill_rankings.course_id = possiblecourses.course_id AND rank_after IS NOT NULL AND skill_id in (' + skillskeys + ') '+';'
	    	, function (error, rows) {
	    	db.all('SELECT course_name, avg(rank_diff) FROM skillcourses GROUP BY course_name ORDER BY avg(rank_diff) DESC LIMIT 5;'
		    	, function (error, rows) {
		    	console.log('~~~~~~~~~~~~~~~~~~');
		    	console.log(rows);
		        res.send(rows);
		    });
	    });
	});
}

app.post('/interestpost', function(req, res) {
	setTimeout(handleip(req, res),200000);
});

function handleip(req, res){
	db.run('DROP VIEW IF EXISTS interestcourses;', function(err) {
		if (err){
			callback(err);
		}
		db.all('CREATE VIEW interestcourses AS SELECT distinct possiblecourses.course_name, possiblecourses.username as username, topic_id, (interest_after-interest_before) as interest_diff FROM possiblecourses, topic_interests ' +
			'WHERE topic_interests.username = possiblecourses.username AND topic_interests.course_id = possiblecourses.course_id AND interest_after IS NOT NULL AND topic_id in (' + intskeys + ') '+';'
	    	, function (error, rows) {
	    	db.all('SELECT course_name, avg(interest_diff) FROM interestcourses GROUP BY course_name ORDER BY avg(interest_diff) DESC LIMIT 5;'
		    	, function (error, rows) {
		    	console.log('~~~~~~~~~~~~~~~~~~');
		    	console.log(rows);
		        res.send(rows);
		    });
	    });
	});
}

app.post('/happypost', function(req, res) {
	setTimeout(handlehp(req, res),200000);
});

function handlehp(req, res){
	db.all('SELECT course_name, avg(eval_score) FROM possiblecourses GROUP BY course_id ORDER BY avg(eval_score) DESC LIMIT 5;'
    	, function (error, rows) {
    	console.log('~~~~~~~~~~~~~~~~~~');
    	console.log(rows);
        res.send(rows);
    });
}

function getpossiblecourses(callback){
	db.run('DROP TABLE IF EXISTS possiblecourses;', function(err) {
		// console.log('good1');
		if (err){
			callback(err);
		}
		db.run('CREATE TABLE possiblecourses (' + 
		'course_id INTEGER,' + 
		'username INTEGER, ' + 
		'grade INTEGER, ' + 
		'eval_score INTEGER, ' +
		'course_name' +
		');', function(err) {
			// console.log('good1');
			if (err){
				callback(err);
			}
			db.all('SELECT distinct enrollments.username as username, letter_grades.max_grade as grade, course_editions.course_id as cid,' +
			 'enrollments.course_ranking as escore, dept_code, course_number FROM enrollments, letter_grades, course_editions, courses' + 
			 ' WHERE courses.course_id = course_editions.course_id AND course_editions.edition_id = enrollments.edition_id AND enrollments.letter_grade = letter_grades.letter_grade ' + 
			 'AND username in (' + chosenusers + ');', function(err, rows) {
				for (var i = 0; i < rows.length; i ++){
					// console.log(rows[i].username);
					db.run('INSERT INTO possiblecourses(course_id, username, grade, eval_score, course_name) VALUES (?,?,?,?,?);',
					 [rows[i].cid, rows[i].username, rows[i].grade, rows[i].escore, rows[i].dept_code + rows[i].course_number], function(err) {     		
		        		if (err){
		        			console.log(err);
		      				callback(err);
		      			}
		      		});
				}
				db.all('SELECT * FROM possiblecourses;', function(err, rows4) {
					console.log(rows4);
					console.log('done this');
					    if (err){
					      	allback(err);
					  	}
				});
			});
		});
	});		
}

var skillskeys = '';
var intskeys = '';
function get_alls(callback) {
	db.run('DROP TABLE IF EXISTS alls;', function(err) {
      	// console.log('good1');
      	if (err){
      		callback(err);
      	}
		db.run('CREATE TABLE alls (' + 
	    'username PRIMARY KEY,' + 
	    'age INTEGER, ' + 
	    'gender TEXT, ' + 
	    'native_country TEXT, ' + 'distance INTEGER' + insertskills + insertints + 
		');', function(err) {
	      	// console.log('good1');
	        if (err){
	      		callback(err);
	      	}
	    });
    });

	db.all('SELECT * FROM students WHERE username != \'' + username +  '\';', function(err, rows) {
		for (var i = 0; i < rows.length; i ++){
			// console.log(rows[i].username);
			db.run('INSERT INTO alls(username,age,gender,native_country) VALUES (?,?,?,?);',
			 [rows[i].username, rows[i].age, rows[i].gender, rows[i].native_country], function(err) {     		
        		if (err){
        			console.log(err);
      				callback(err);
      			}
      		});
		}

		var skillids = {};
		skillskeys = '';
		var c = 0;
		for (var key in skills) {
			// var n = parseInt(key);
    		skillskeys += key + ', ';
    		skillids[key] = c;
    		c += 1;
    	}
    	skillskeys = skillskeys.slice(0, -2);
		console.log(skillids);

		var intids = {};
		intskeys = '';
		c = 0;
		for (var key in interests) {
			// var n = parseInt(key);
    		intskeys += key + ', ';
    		intids[key] = c;
    		c += 1;
    	}
    	intskeys = intskeys.slice(0, -2);
		console.log(intids);



		db.all('SELECT distinct username, course_id, skill_id, rank_before FROM skill_rankings WHERE skill_id in (' + skillskeys + ');', function(err, rows2) {
			console.log(rows2);
			for (var i = 0; i < rows2.length; i ++){
				var id = skillids[rows2[i].skill_id];
				var before = rows2[i].rank_before;
				var u = rows2[i].username;
				var ss = 'UPDATE alls SET skill_id' + id + '= ' + before + ' WHERE username= \'' + u + '\' ;'
				// console.log(ss);
				db.run(ss, function(err) {     		
	        		if (err){
	        			console.log(err);
	      				callback(err);
	      			}
	      		});
			}
			db.all('SELECT distinct username, course_id, topic_id, interest_before FROM topic_interests WHERE topic_id in (' + intskeys + ');', function(err, rows3) {
				// console.log(rows3);
				for (var i = 0; i < rows3.length; i ++){
					var id = intids[rows3[i].topic_id];
					var before = rows3[i].interest_before;
					var u = rows3[i].username;
					var ss = 'UPDATE alls SET interest_id' + id + '= ' + before + ' WHERE username= \'' + u + '\' ;' ;
					// console.log(ss);
					db.run(ss, function(err) {     		
		        		if (err){
		        			console.log(err);
		      				callback(err);
		      			}
		      		});
				}
				var del = '';
				var n;
				for (var key in skills) {
					n = skillids[key];
					del += 'skill_id' + n + ' is null AND ';
				}
				for (var key in interests) {
					n = intids[key];
					del += 'interest_id' + n + ' is null AND ';
				}
				del = del.slice(0, -4);
				del += ';' ;
				// console.log(del);
				db.run('DELETE FROM alls WHERE ' + del, function(err) {     		
		        	if (err){
		        		console.log(err);
		      			callback(err);
		      		}
				    console.log(malepercent);
				    console.log(avgage);
				    console.log(userinfo);
		      		db.all('SELECT * FROM alls;', function(err, rows4) {
				    	// console.log(rows4);
				        if (err){
				      		callback(err);
				    	}
						for (var i = 0; i < rows4.length; i ++){
							var uname = rows4[i].username;
							var age = rows4[i].age;
							var dage;
							if (age == null){
								dage = (userinfo.age - avgage) * (userinfo.age - avgage);
							} else {
								dage = (userinfo.age - age) * (userinfo.age - age);
							}
							var gender = rows4[i].gender;
							var dgen;
							if (gender == null){
								if (userinfo.gender == 'm'){
									dgen = (1 - malepercent) * (1 - malepercent);
								} else {
									dgen = malepercent * malepercent;
								}
							} else {
								if (userinfo.gender == gender){
									dgen = 0;
								} else {
									dgen = 1;
								}
							}
							var country = rows4[i].native_country;
							var dcountry;
							if (country == userinfo.native_country){
								dcountry = 0;
							} else {
								dcountry = 1;
							}
							var m;
							var n;
							var s0 = rows4[i].skill_id0;
							var ds0;
							if (s0 == null){
								ds0 = 25;
							} else {
								m = Object.keys(skills)[0].toString();
								n = parseInt(skills[m]);
								ds0 = (n - s0) * (n - s0);
							}
							var s1 = rows4[i].skill_id1;
							var ds1;
							if (s1 == null){
								ds1 = 25;
							} else {
								m = Object.keys(skills)[1].toString();
								n = parseInt(skills[m]);
								ds1 = (n - s1) * (n - s1);
							}
							var s2 = rows4[i].skill_id2;
							var ds2;
							if (s2 == null){
								ds2 = 25;
							} else {
								m = Object.keys(skills)[2].toString();
								n = parseInt(skills[m]);
								ds2 = (n - s2) * (n - s2);
							}
							var s3 = rows4[i].skill_id3;
							var ds3;
							if (s3 == null){
								ds3 = 25;
							} else {
								m = Object.keys(skills)[3].toString();
								n = parseInt(skills[m]);
								ds3 = (n - s3) * (n - s3);
							}
							var s4 = rows4[i].skill_id4;
							var ds4;
							if (s4 == null){
								ds4 = 25;
							} else {
								m = Object.keys(skills)[4].toString();
								n = parseInt(skills[m]);
								ds4 = (n - s4) * (n - s4);
							}
							var i0 = rows4[i].interest_id0;
							var di0;
							if (i0 == null){
								di0 = 25;
							} else {
								m = Object.keys(skills)[0].toString();
								n = parseInt(skills[m]);
								di0 = (n - i0) * (n - i0);
								// console.log('m: ' + m + ' n: ' + n + ' i0: ' + i0 + ' di0: ' + di0);
							}
							var i1 = rows4[i].interest_id1;
							var di1;
							if (i1 == null){
								di1 = 25;
							} else {
								m = Object.keys(skills)[1].toString();
								n = parseInt(skills[m]);
								di1 = (n - i1) * (n - i1);
								// console.log('m: ' + m + ' n: ' + n + ' i0: ' + i0 + ' di0: ' + di0);
							}
							var i2 = rows4[i].interest_id2;
							var di2;
							if (i2 == null){
								di2 = 25;
							} else {
								m = Object.keys(skills)[2].toString();
								n = parseInt(skills[m]);
								di2 = (n - i2) * (n - i2);
							}
							var i3 = rows4[i].interest_id3;
							var di3;
							if (i3 == null){
								di3 = 25;
							} else {
								m = Object.keys(skills)[3].toString();
								n = parseInt(skills[m]);
								di3 = (n - i3) * (n - i3);
							}
							var i4 = rows4[i].interest_id4;
							var di4;
							if (i4 == null){
								di4 = 25;
							} else {
								m = Object.keys(skills)[4].toString();
								n = parseInt(skills[m]);
								di4 = (n - i4) * (n - i4);
							}
							var sum = dage + dgen + dcountry + ds0 + ds1 + ds2 + ds3 + ds4 + di0 + di1 + di2 + di3 + di4;
							// console.log(uname + ": " + sum);
							// console.log(dage + ', ' + dgen + ', ' + dcountry + ', ' + ds0 + ', ' + ds1 + ', ' + ds1 + ', ' + ds2 + ', ' + ds3 + ', ' + ds4 + ', ' + di0 + ', ' + di1 + ', ' + di2 + ', ' + di3 + ', ' + di4);
							var ss = 'UPDATE alls SET distance= ' + sum + ' WHERE username= \'' + uname + '\' ;' ;
							console.log(ss);
							db.run(ss, function(err) {     		
		        				if (err){
		        					console.log(err);
		      						callback(err);
			      				}
			      			});
						}
						db.all('SELECT * FROM alls ORDER BY distance LIMIT 15;', function(err, rrr) {
							// console.log(rrr);
							for (var i = 0; i < rrr.length; i ++){
								uname = rrr[i].username;
								if (i == 0){
									chosenusers = '\'' + uname + '\'';
								}else{
									chosenusers += ', ';
									chosenusers += ('\'' + uname + '\'');
								}
							}
							console.log(chosenusers);
							if (err){
							    callback(err);
							}
							getpossiblecourses();
						});
				    });
		      	});
			});
		});
    });
    callback();
}


var courses = [ '1', '2', '3' ];
var interests = { '72': '3', '52': '4', '5': '4', '22': '4', '82': '2' };
var skills = { '57': '2', '77': '2', '40': '3', '35': '2', '7': '1' };
var insertskills = '';
var insertints = '';
var malepercent;
var avgage;
var username;
var userinfo;
var chosenusers = '';
function setinsert(){ 
	// console.log('here');
	var c = 0;
    for (var key in skills) {
    	insertskills += ', skill_id' + c + ' INTEGER';
    	c+= 1;
    }
    // console.log(insertskills);
    c = 0;
    for (var key in interests) {
    	insertints += ', interest_id' + c + ' INTEGER';
    	c += 1;
    }
    // console.log(insertints);
}
function getuserinfo(){
	db.all('SELECT * FROM students WHERE username = \'' + username  + '\' ;', function(err, numm) {
		console.log(numm);
		if (err){
			callback(err);
		}	
		userinfo = numm[0];
	});
}
function getpercentmale(callback){
	db.all('SELECT count(username) as num FROM students WHERE gender = \'m\' ;', function(err, numm) {
		// console.log(numm);
		if (err){
			callback(err);
		}
		db.all('SELECT count(username) as num FROM students;', function(err, nummstu) {
			// console.log(nummstu);
			if (err){
				callback(err);
			}
			// console.log(numm[0].num/nummstu[0].num);
			malepercent = (numm[0].num/nummstu[0].num);
		});
	});	
}

function getavgage(callback){
	db.all('SELECT avg(age) as num FROM students;', function(err, numm) {
		// console.log(numm);
		if (err){
			callback(err);
		}
		avgage = numm[0].num
	});	
}

//***********Helper functions
function is_loggedin(req, res, next) {
    if (!req.session.username) {
        console.log('Error: please log in//already logged out');
        res.redirect('/login');
    } else {
        next();
    }
}

function is_loggedout(req, res, next) {
    if (req.session.username) {
        console.log('Error: please log out');
        res.redirect('/dashboard');
    } else {
        next();
    }
}

app.post('/login', function(req, res) {
  var username1 = req.body.username;

  db.all("SELECT * FROM students WHERE username = '" + username1 + "'", function(err, rows) {
    if(err) {
      throw err;
    }
    if(!rows || rows.length > 1) {
      throw "this shouldn't happen";
    }

    if(rows.length === 1) {
      req.session.username = rows[0].username;
      username = rows[0].username;
      res.redirect('/first');
    } else {
      res.render('login.html', { error: 'Invalid username' });
    }
  });
});

app.post('/signup', function(req, res) {
	// Don't permit already-logged-in users to signup again.
	if(req.session.username !== undefined) {
		res.redirect('/dashboard');
	    return;
	}
	var username1 = req.body.username;
	var age = req.body.age;
	var gender = req.body.gender;
	var country = req.body.country;

	username = username1;

	create_user(username1, age, gender, country, function(err, username) {
		if (err) {
			console.log(err);
	      	res.render('signup.html', {error: err});
	    } else {
	     	// This way subsequent requests will know the user is logged in.
	     	// console.log('good2');
	      	req.session.username = username1;
	      	username = username1;
	      	console.log(username);
	      	res.redirect('/first');  
	    }
	});
});

function create_user(username, age, gender, country, callback) {
	db.all('SELECT username FROM students WHERE username = ?', [username], function(err, rows) {
    	if(rows.length > 0) {
        	callback('Username taken');
        	return;
      	}
      	db.run('INSERT INTO students (username, permission, age, gender, native_country) VALUES (?, ?, ?, ?, ?)', [username, 0, age, gender, country], function(err) {
      		// console.log('good1');
        	callback(err, username);
      	});
    });
}


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
