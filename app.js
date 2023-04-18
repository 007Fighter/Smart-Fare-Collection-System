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
