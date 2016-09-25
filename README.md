# CourseRecommender

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

7. Data collection

After the user explored all his recommendations and before he exits, he is prompted to add his own data to the CEA database. For each course he has already taken the regular questions such as grade, course rank and instructor rank are asked. The user may want to add new topics and skills, and record skill improvements and topic interest dynamics.
