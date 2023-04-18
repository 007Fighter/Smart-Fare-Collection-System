const express = require("express");

const connection = require("../connection");

const router = express.Router();

var journeydistance = 0;
var currentloc;

router.get('/myapi', async (req, res, next) => {
    try{
        const {passenger, card, ssid, vehicle, board } = req.query;
        var currtime = time().toString();
        console.log(passenger, card, ssid, vehicle, board, currtime);                        
        setTimeout(() => {                        
            //fetch location by SSID
            connection.query('SELECT `lat_long` FROM `location` WHERE ssid = ?', ssid, (err, loc) => {
                try{
                    if (loc.length > 0) {
                        console.log(loc);       //checked OK
                        currentloc = loc[0].lat_long;
                    }else{
                        return next();
                    }
                }catch (err){
                    console.log(err);
                }
            }),
        
            // Check if Card is Registered =>
            connection.query('SELECT * FROM `passenger` WHERE card_no = ?', card, (err, rows) => {
                    // Check if Card is Registered
                    if (rows.length > 0) {      //  Registered
                        console.log("Registered : ", rows);           //checked OK
                        // Check if minimum balance in wallet and also it's active..... =>
                        connection.query('SELECT `balance`, `status` FROM `wallet` WHERE user_id = ? GROUP BY time DESC', rows[0].user_id, (err, data) => {
                            console.log("Minimum Balnce & Active : ", data[0]);                 //checked OK
                            if (data.length > 0 && data[0].balance >= 10 && data[0].status == 1) {      //yes minimum balance & active
                                // Check if Previous Boarding Journey exists =>
                                connection.query('SELECT * FROM `uses` WHERE `card_no` = ? GROUP BY id_no DESC', 
                                card, (err, journey) => {
                                    // check whether same dated previous boarding journey exists
                                    console.log("Journey Status : ",journey[0].journey_status);
                                    if (journey.length > 0 && journey[0].journey_status == 1) {         // yes now leaving the vehicle
                                        console.log("Leaving : ", journey[0]);      
                                        source = journey[0].source_loc;

                                        // check whether boarding journey was on same vehicle
                                        if(journey[0].vehicle_no == vehicle){           // same vehicle

                                            // distannce calculator caller
                                            dist(source, currentloc, (err, res) =>{
                                                if(!err){
                                                    console.log("Res : ", res.distance);
                                                    journeydistance = res.distance;
                                                    console.log("From Dist : ", journeydistance);
                                                }
                                            })

                                    setTimeout(() => {
                                            // fare calculator caller
                                            let farecalc = fare(journeydistance);

                                            connection.query('UPDATE `uses` SET ? WHERE card_no = ? AND id_no = ?', [{ destination_time: currtime, 
                                            destination_loc: currentloc, distance: journeydistance, fare: farecalc, journey_status:"0" }, card, journey[0].id_no], 
                                            (err) => {
                                                if (!err) { 
                                                    res.status(900);
                                                    res.json({status: true, message: "Passenger Leaving"});
                                                }else {
                                                    console.log(err);
                                                    return next();
                                                }
                                            })
                                            connection.query('SELECT * FROM `wallet` WHERE card_no = ? ORDER BY time DESC', card, (err, wallet) => {
                                                console.log(wallet[0]);
                                                if (!err) { 
                                                var currbalance = Number(wallet[0].balance) - farecalc;
                                                    connection.query('INSERT INTO `wallet` SET ?', { card_no: card, trans_type: "Deducted", 
                                                    amount: farecalc, balance: currbalance, time: currtime, status: 0, user_id: wallet[0].user_id, status: wallet[0].status }, (err) => {
                                                        if (!err) { 
                                                            res.status(900);
                                                            res.json({status: true, message: "Passenger Leaving"});
                                                        }else {
                                                            console.log(err);
                                                            return next();
                                                        }
                                                    })
                                                } else {
                                                    console.log(err);
                                                    return next();
                                                }
                                            })
                                        }, 4000);
                                        }else {                  // another vehicle fine charge 2 Token
                                            if(isSeatAvailable(passenger, 1)){     // is Seat Available
                                                console.log(isSeatAvailable(passenger, 2));        

                                                // Charge Fine & Update Previous Journey as Completed
                                                connection.query('UPDATE `uses` SET ? WHERE card_no = ? AND id_no = ?', 
                                                [{ destination_time: currtime, destination_loc: journey[0].source_loc, 
                                                distance: "0", fare: "2", journey_status:"0" }, card, journey[0].id_no], 
                                                (err, rows) => {
                                                    if (err) { 
                                                        res.status(950); 
                                                        res.json({status: true, message: "Try Again"}); 
                                                        console.log(err); return next();
                                                    }
                                                })
                                                connection.query('SELECT * FROM `wallet` WHERE card_no = ? ORDER BY time DESC', card, (err, wallet) => {
                                                    if (!err) { 
                                                    var currbalance = Number(wallet[0].balance) - 2;
                                                        connection.query('INSERT INTO `wallet` SET ?', { card_no: card, trans_type: "Deducted", 
                                                        amount: 2, balance: currbalance, time: currtime, status: 0, user_id: wallet[0].user_id, status: wallet[0].status }, (err) => {
                                                            if (!err) { 
                                                                res.status(900);
                                                                res.json({status: true, message: "Passenger Leaving"});
                                                            }else {
                                                                console.log(err);
                                                                return next();
                                                            }
                                                        })
                                                    }
                                                    else {
                                                        console.log(err);
                                                        return next();
                                                    }
                                                })
                                                // Initiate New Journey as Boarded
                                                connection.query('INSERT INTO `uses` SET ?', 
                                                { card_no: card, source_time: currtime, source_loc: currentloc, 
                                                vehicle_no: vehicle, journey_status: "1" }, (err) => {
                                                    if (!err) { 
                                                        res.status(850); 
                                                        res.json({status: true, message: "Passenger Boarding"}); 
                                                    } else {
                                                        console.log(err); 
                                                        return next();
                                                    }
                                                })
                                            }else {
                                                res.status(980); 
                                                res.json({status: true, message: "Seat not Available."}); 
                                                return next();
                                            }       // checking if seat available closes
                                        }           // checking if boarding journey was on same vehicle set closes
                                    }               //checking of previous boarding journey closes


                                    // check whether new boarding journey
                                    else if ((journey.length >= 0 && journey[0].journey_status == 0) || journey.length == 0){
                                        console.log("Boarding", journey[0]);
                                        if(journey[0].fare == 2){
                                            //#### Departing Journey Logic ####
                                            // distannce calculator caller
                                            console.log("Leaving : ", journey[0]);      
                                            source = journey[0].source_loc.toString;

                                            dist(source, currentloc, (err, res) =>{
                                                if(!err){
                                                    console.log("Res : ", res.distance);
                                                    journeydistance = res.distance;
                                                    console.log("From Dist : ", journeydistance);
                                                }
                                            })
                                    setTimeout(() => {
                                            // fare calculator caller
                                            let farecalc = fare(journeydistance);

                                            connection.query('UPDATE `uses` SET ? WHERE card_no = ? AND id_no = ?', [{ destination_time: time(), 
                                            destination_loc: locate, distance: journeydistance, fare: farecalc, journey_status:"0" }, card, journey[0].id_no], 
                                            (err) => {
                                                if (!err) { 
                                                    res.status(900);
                                                    res.json({status: true, message: "Passenger Leaving"});
                                                }else {
                                                    console.log(err); 
                                                    return next();
                                                }
                                            })
                                        }, 2500);
                                        }else {
                                            if(isSeatAvailable(passenger, 2)){
                                                console.log(isSeatAvailable(passenger, 2));

                                                connection.query('INSERT INTO `uses` SET ?', { card_no: card, passengeruser_id: rows[0].user_id, 
                                                vehicle_no: vehicle, source_time: currtime, 
                                                source_loc: currentloc, journey_status: 1 }, (err, rows) => {
                                                    if (err) {  console.log(err);  return next(); }
                                                    else { res.status(800); res.json({status: true, message: "Passenger Boarding"});}
                                                })
                                            }else {
                                                res.status(950); 
                                                res.json({status: true, message: "Seat not Available."}); 
                                                return next();
                                            }       // checking if seat available closes
                                        }
                                    }
                                })
                            }else{      //Wallet Issue either inactive or low balance
                                res.status(850);
                                res.json({status: true, message: "Wallet Issue"});
                                console.log("Wallet Issue");
                                return next();
                            }   // Check if Minimum Card balance closes
                        })
                    }else{      //Not Registered
                        res.status(500);
                        res.json({status: true, message: "Card not Registered"});
                        console.log("Card not Registered");
                        return next();
                    }       // Checking if Card is Registered closes
            })
        }, 3000);
    }catch (err){
        console.log(err);
        return next();
    }
});

    // google api to measure distance 
    function dist (source, destiny, callback){
        const googleMapsClient  = require('@google/maps').createClient({
            key: 'Your_api_key'
        });
        googleMapsClient.directions({
            origin: source,
            destination: destiny,
            mode: "driving",
        }, function(err, response) {
            if (!err) {
                console.log(response.json.routes[0].legs[0].distance.value);
                setTimeout(()=> callback(null, {distance : response.json.routes[0].legs[0].distance.value}), 1000);
            }else{
                console.error("ERR", err);
            }
        })
    }

function fare(distance) {
    const fare_unit = 1000;    // in meters
    const fare_unit_charge = 3;     // in Tokens
    if(distance < (fare_unit)){
        var fare = 0;
    }else {
        var fare = (distance / fare_unit) * fare_unit_charge;
    }
    console.log('Fare : ', fare);
    console.log('Fare : ',parseInt(fare));
    return parseInt(fare);
}

function isSeatAvailable(passenger, seat){
    if(passenger >= 0 && passenger < seat){
        return true;
    }else{
        return false;  
    }
}

//time fetcher
function time() {
    // current date time
    let date_ob = new Date();
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    // current hours
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    // current seconds
    let seconds = date_ob.getSeconds();

    // formats date & time in YYYY-MM-DD HH:MM:SS format
    let time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    return time;
}

module.exports = router;

/* Response Codes (Application Specific defined in serverside)
 *    800 -> Boarding Success (Green)
 *    900 -> Leaving Success (Green)
 *    850 -> Low Balance & another issues (Blue)
 *    950 -> Seat Full (Red)
 *    500 -> Card Not Registered
 *    900 -> Red   LED -> Non-registered cards 
 *    850 -> Blue  LED -> Not Enough Balance in cards 
 *    800 -> Green LED -> Amount deduct success on cards
 */
