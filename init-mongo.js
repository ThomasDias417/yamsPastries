db = db.getSiblingDB('yams_db');
data = cat('/tmp/pastries.json');
data = JSON.parse(data);
db.yams_db.insert(data);
