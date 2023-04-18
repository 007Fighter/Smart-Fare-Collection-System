const path = require('path');
const express = require('express');
const ejs = require('ejs');

const app = express();
const cookieParser = require('cookie-parser');

require('./connection');

//set views file
app.set('views',path.join(__dirname,'views'));

const css_directory = path.join(__dirname, './assets')
app.use(express.static(css_directory));

//Parse url encoded bodies(sent by HTML forms)
app.use(express.urlencoded({extended : false}));
//Parse JSON bodies(sent by API clients)
app.use(express.json());

app.use(cookieParser());

//set view engine
app.set('view engine', 'ejs');

// Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/officer', require('./routes/officer'));
app.use('/passenger', require('./routes/passenger'));
app.use('/conductor', require('./routes/conductor'));


// Server Listening
app.listen(3500, () => {
    console.log('Server is running at port 3500');
});


// test zone
// var journeydistance = 0;
    // google api to measure distance 
    // var dist = function(source, destiny, callback){
    //     const googleMapsClient  = require('@google/maps').createClient({
    //         key: 'AIzaSyA5fav9dMmYViqtOp7p_4JEZpVsfBVnzMM'
    //     });
    //     googleMapsClient.directions({
    //         origin: source,
    //         destination: destiny,
    //         mode: "driving",
    //     }, function(err, response) {
    //         if (!err) {
    //             console.log(response.json.routes[0].legs[0].distance.value);
    //             setTimeout(()=> callback(null, {distance : response.json.routes[0].legs[0].distance.value}), 50);
    //         }else{
    //             console.error("ERR", err);
    //         }
    //     })
    // }

    // dist('22.266245, 88.354607', '22.238052, 88.272562', (err, res) =>{
    //     if(!err){
    //         console.log("Res : ", res.distance);
    //         journeydistance = res.distance;
    //         console.log("From Dist : ", journeydistance);
    //     }
    // })

    // setTimeout(() => {console.log("It's me : ", journeydistance);}, 1000);
// test zone
