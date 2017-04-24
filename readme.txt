1. First import the given database using given command
mongorestore -d "twitter_assignment" <directory_backup>
Db would be in db folder.

2. You can also start again polling by just click on pull tweets nav bar. After that if search not work please run this query for creating the index.
db.getCollection('analytics_data').createIndex({"statuses.text":"text"})

3. For now filter only work if the time is provided in twitter created_at attribute format. I tried but not succeed to change tge given date to twitter create_at attribute format.

4.Line chart and pie chart doesent work. I tried for group by query but not succeed. I am new to mongo db. I got the count but didn't get count with the data like(unique location and time)

