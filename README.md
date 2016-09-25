# CSC343_CourseRecommendor

In cmd type nom install

In cmd type node server.js

Go to http://localhost:3000/



Functionality

1. Initial user information
An active user logs in and if his user name is not found in the database, the initial demographic information is collected and recorded into the Students table. Otherwise the existing information is used.

2. Collecting user courses
The first step is to identify which courses this student has taken. This applies to both a new and a returning user. The courses are not added to the existing database yet, but are recorded into an appropriate data structure for the future use.

3. Collecting user interests
Then the user needs to express his interest in the available topics. The topics are presented grouped by departments, to make navigation and selection easier. The user does not have to rank all the available topics.

4. Collecting user skills
Next the user accesses his level of different skills, which are also presented grouped by the departments. Again, the user has the right to omit some skills.

5. Computing potential recommendations
The program then finds 15 users which are most similar to an active user by their demographic characteristics, level of skills before the course, and topic interests before the course. It extracts all courses which these top 15 users have ranked, except the ones which have been already taken by the active user. Do not forget to exclude an active user himself from the set of his nearest neighbors.

6. Presenting recommendations based on the user-specified criteria
At this point the user is presented with the choice of how he wants his recommendations to be ranked.
 “Recommend courses with the best predicted grade”
The first choice is by the expected grade. For each course that program has identified as possible recommendation, it computes an average grade, based on the numeric max_grade corresponding to the letter grade, and converts it to the letter grade again. Then all the recommendations are sorted by this average grade in descending order and 5 top are presented to the active user.
 “Recommend courses which promote my interests”
The second choice is based on the development of student interests in different topics. The program will rank the potential candidate courses by an average increase in topic interest after the course, taking into account only those topics that the user expressed some interest in.
 “Recommend courses which improve my skills”
The third choice is based on an average skill improvement after each course. Again, the courses with the best skill improvement are presented as course recommendations. For both option 2 and option 3, the relevant improvements are summed up for each course before averaging them among all 15 nearest neighbors.
 “Recommend courses which make me happy” (with the best predicted evaluation score)
Finally, the user may select to see the recommended courses based on the best average course satisfaction.
You do not have to apply additional weights to all the values computed above, however if you want you may weigh each value by the inverse of the distance from an active user (see book examples for details)

7. Data collection
After the user explored all his recommendations and before he exits, he is prompted to add his own data to the CEA database. For each course he has already taken the regular questions such as grade, course rank and instructor rank are asked. The user may want to add new topics and skills, and record skill improvements and topic interest dynamics.
