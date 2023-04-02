# BoilerTime
BoilerTime is a data-driven class schedule optimizer for Purdue University. 

## Running Instructions
To run the project in its entirety, three different components must be run. 

### Backend
To run the backend, follow these instructions. 
```
cd backend 
yarn install
node index.js
```

### Frontend
To run the frontend, follow these instructions. 
```
cd frontend 
yarn install
yarn dev
```

### Optimizing Algorithm
To run the optimizing algorithm
```
cd optimizer 
java -jar btime.jar
```

In order to execute sucessfully, localhost ports 3000, 3001, and 3002 must be open. 