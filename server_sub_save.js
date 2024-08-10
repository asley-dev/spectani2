const express = require('express');
const http = require('http');
const mqtt = require('mqtt');
const mysql = require('mysql');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static('public'));

// Connect to the MQTT broker
const client = mqtt.connect('mqtt://broker.emqx.io');

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mqtt_test'
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

client.on('connect', function() {
    console.log('Connected to MQTT broker');
    client.subscribe('presencex', function(err) {
        if (err) {
            console.error('Error subscribing to topic: ' + err.message);
        } else {
            console.log('Subscribed to topic presencex');
        }
    });
});

client.on('message', function(topic, message) {
    // message is Buffer
    const messageStr = message.toString();
    console.log('Received message:', messageStr);

    // Send the message to the connected clients
    io.emit('mqttMessage', messageStr);

    // Insert message into the database
    const query = 'INSERT INTO pesan (`body_pesan`) VALUES (?)';
    connection.query(query, [messageStr], function(error, results, fields) {
        if (error) {
            console.error('Error inserting into database: ' + error.message);
        } else {
            console.log('Data inserted into database');
        }
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
