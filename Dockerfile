FROM mongo:latest

# Copy pastries.json to the container
COPY pastries.json /tmp/pastries.json

# Import data into MongoDB
RUN mongoimport --host mongoDb:27017 --db yams_db --collection pastries --jsonArray --type json --file /tmp/pastries.json --username='root' --password='password' --authenticationDatabase=admin

# Expose MongoDB port
EXPOSE 27017

# Start MongoDB
CMD ["mongod"]