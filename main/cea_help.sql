DROP VIEW IF EXISTS DMovies;
CREATE VIEW DMovies AS
	SELECT distinct Topics.topic_id, Topics.topic, Courses.dept_code
	FROM Topics, Course_topics, Courses
	WHERE Topics.topic_id = Course_topics.topic_id and 
	Course_topics.course_id = Courses.course_id;
	
select * from DMovies;

DROP VIEW IF EXISTS stuall;
CREATE VIEW stuall AS
	SELECT distinct students.username, skill_rankings.skill_id, skill_rankings.rank_before, topic_interests.topic_id, topic_interests.interest_before
	FROM students, skill_rankings, topic_interests
	WHERE (students.username = skill_rankings.username and skill_id in (57, 77, 40, 35, 7) )
	and (students.username = topic_interests.username and topic_id in (72, 52, 5, 22, 82))
	order by students.username;