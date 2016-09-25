DROP VIEW IF EXISTS stuall;
CREATE VIEW stuall AS
	SELECT enrollments.username as username, 
	letter_grades.max_grade as grade, 
	course_editions.course_id as cid, 
	enrollments.course_ranking as escore
	FROM enrollments, letter_grades, course_editions
	WHERE course_editions.edition_id = enrollments.edition_id AND enrollments.letter_grade = letter_grades.letter_grade 
	AND username in ('nielie', 'raz24', 'student335', 'cai', 'madame_id', 'ncjc', '960120', 'ccccc', 'ilovechicken', 'JiH');
select * from stuall;