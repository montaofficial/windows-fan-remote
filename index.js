const WebSocket = require('ws');
const { exec } = require("child_process"); 

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 5556 });

let lastMessage = '';

// Handle incoming connections
wss.on('connection', (ws) => {
    // Handle incoming messages from clients
    ws.on('message', (message) => {
        lastMessage = message;
        ws.send(lastMessage +"");
        exec(`"C:\\Program Files (x86)\\FanControl\\FanControl.exe" -c "${message}.json"`, (err, outs, errs) => { 
            console.log(outs); 
            console.warn(err || errs || ''); 
        }); 
    });

    // Send the last message to the client every 2 seconds
    const interval = setInterval(() => {
        ws.send(lastMessage+"");
    }, 2000);

    // Handle client disconnection
    ws.on('close', () => {
        clearInterval(interval);
    });
});