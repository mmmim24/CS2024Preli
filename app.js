require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Users = require("./models/userModel");
const Trains = require("./models/trainModel");
const Stations = require("./models/stationModel");

const { PORT,MONGODB_URI } = process.env;

const dbUrl = MONGODB_URI;

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.log("Connection failed!", error);
    process.exit();
  });

const app = express();
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.json({message: "Welcome to dream theatre"});
})

app.post("/api/users", async (req, res) => {
  const {user_id,user_name,balance} = req.body;
  try {
    const newUser = new Users({
      user_id,user_name,balance
    });
    const User = await newUser.save();
    res.status(201).json(User);
      
    } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Failed to add User'});
  }
});

app.get("/api/users", async (req, res) => {
  try {
    let users;
    users = await Users.find();
    if(users.length>0){
      res.json(users);
    }
    else{
      res.status(404).json({message: 'no users found'});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Failed to get users'});
  }
});

app.get("/api/wallets/:walletid", async (req, res) => {
  try {
    const walletID = req.params.walletid;
    let users;
    users = await Users.findOne({user_id:walletID});
    const {user_id,user_name,balance} = users;
    if(users){
      res.json(
        {
          "wallet_id": walletID,
          balance,
          "wallet_user":{
            user_id,
            user_name
          }
        }
      // users
      );
    }
    else{
      res.status(404).json({message: `wallet with id: ${walletID} was not found`});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Failed to get wallet'});
  }
});

app.put("/api/wallets/:walletid", async (req, res) => {
  const {recharge} = req.body;
  const walletID = req.params.walletid;
  let users;
  let response,code;
  users = await Users.findOne({user_id:walletID});
  let {user_id,user_name,balance} = users;
  if (recharge>=100&&recharge<=10000){
    balance += recharge;
    code = 200;
    response = {
      "wallet_id": walletID,
      balance,
      "wallet_user":{
        user_id,
        user_name
      }
    }
  } 
  else{
    code = 400;
    response = {message:`invalid amount: ${recharge}`}
  }
  try {
    users = await Users.findOneAndUpdate(
      {user_id:walletID},
      {"balance":balance},
      {new:true}
    )
    if(users){
        res.status(code).json(
          {message:`invalid amount: ${recharge}`}
        );
    }
    else{
      res.status(404).json({message: `wallet with id: ${walletID} was not found`});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Failed to get wallet'});
  }
});

app.post("/api/tickets", async (req, res) => {
  const {user_id,balance} = await Users.find();
  let ticket_id = user_id+245586;
  try {
      res.json({
        ticket_id,
        "wallet_id": user_id,
        balance,
        "stations": [
          {
          "station_id": 1,
          "train_id": 3,
          "departure_time": "11:00",
          "arrival_time": null,
          },
          {
          "station_id": 3,
          "train_id": 2,
          "departure_time": "12:00",
          "arrival_time": "11:55"
          },
          {
          "station_id": 5,
          "train_id": 2,
          "departure_time": null,
          "arrival_time": "12:25"
          }
        ]
      });
    }
  catch (error) {
    console.log(error);
    res.status(500).json({error: 'Failed to add station'});
  }
});

app.post("/api/stations", async (req, res) => {
  const {station_id,station_name,longitude,latitude} = req.body;
  try {
    const newStation = new Stations({
      station_id,station_name,longitude,latitude
    });
    const Station = await newStation.save();
    res.status(201).json(Station);
      
    } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Failed to add station'});
  }
});

app.get("/api/stations", async (req, res) => {
  try {
    let {station_id} = await Stations.find() ;
    let stations = await Stations.find().sort({station_id:1}).exec();
    if(stations.length>0){
      res.json(stations);
    }
    else{
      res.status(404).json({stations: []});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Failed to get stations'});
  }
});


app.get('/api/stations/:station_id/trains', async (req, res) => {
  try {
      const ID = req.params.station_id;

      
      const trains = await Trains.find({'stops.station_id': ID}).exec();

      
      trains.sort((a, b) => {
          const stopA = a.stops.find(stop => stop.station_id === ID);
          const stopB = b.stops.find(stop => stop.station_id === ID);
          
          if (!stopA.departure_time && stopB.departure_time) return -1;
          else if (stopA.departure_time && !stopB.departure_time) return 1;
          else if (stopA.departure_time && stopB.departure_time) {
              const comp1 = stopA.departure_time.localeCompare(stopB.departure_time);
              if (comp1 !== 0) {
                  return comp1;
              }
            
              const comp2 = stopA.arrival_time.localeCompare(stopB.arrival_time);
              if (comp2 !== 0) {
                  return comp2;
              }
          }
          
          return a.train_id - b.train_id;
      });

      let response;          
      response = {
          station_id: ID,
          trains: trains.map(train => ({
              train_id: train.train_id,
              arrival_time: train.stops.find(stop => stop.station_id === ID)?.arrival_time || null,
              departure_time: train.stops.find(stop => stop.station_id === ID)?.departure_time || null
          }))
      };
      if(response){
        res.json(response); 

      } 
      else{
        res.status(404).json({message:`"station with id: ${station_id} was not found`})
      }
  } 
  catch (error) {
      console.error(error);
      res.status(500).json({ error: 'failed to get trains' });
  }
});

app.post("/api/trains", async (req, res) => {
  const {train_id,train_name,capacity,stops} = req.body;
  const num_stations = stops.length;
  const service_start = stops[0].departure_time;
  const service_ends = stops[num_stations-1].arrival_time;
  try {
    const newTrain = new Trains({
      train_id,train_name,capacity,stops
    });
    const Train = await newTrain.save();
    res.status(201).json({
      train_id,
      train_name,
      capacity,
      "service_start": service_start,
      "service_ends": service_ends,
      "num_stations": num_stations
    });
      
    } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Failed to add Train'});
  }
});

app.get("/api/trains", async (req, res) => { 
  try {
    let trains;

    trains = await Trains.find();
    if(trains.length>0){
      res.json(trains);
    }
    else{
      res.status(404).json({message: 'no trains found'});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Failed to get trains'});
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
