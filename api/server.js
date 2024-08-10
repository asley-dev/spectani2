const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const mqtt = require('mqtt');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to the MQTT broker
const client = mqtt.connect('mqtt://broker.emqx.io');

// Middleware to serve static files
app.use(express.static('public'));

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

app.post('/publish', (req, res) => {
    const message = req.body.message;
    const topic = 'presencex';

    client.publish(topic, message, (err) => {
        if (err) {
            res.status(500).json({ response: 'Error publishing message: ' + err.message });
        } else {
            res.status(200).json({ response: 'Message published: ' + message });
        }
    });
});

client.on('connect', () => {
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
});

client.on('error', (err) => {
    console.error('Connection error: ' + err.message);
});

// Start the server
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

// Export the app for serverless deployment
module.exports = app;
