// // Signaling Server

// const http = require('http');
// const WebSocket = require('ws');
// // Load the Platform.sh configuration
// const config = require('platformsh-config').config();


// const server = http.createServer(function (request, response) {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end("Hello world!");
// });
// const wss = new WebSocket.Server({ server });

// // Store connected clients
// const clients = new Map(); // MAP<UUID,ws>
// const usernames = new Map(); //MAP<UUID,username>

// wss.on('connection', (ws) => {
//   // console.log('Client connected: ' + ws._socket.remoteAddress);

//   ws.on('message', (message) => {
//     // You can handle incoming messages if needed
//     try {
//         const parsedMessage = JSON.parse(message);
//         // console.log('Received message:', parsedMessage);

//         // Handle different message types
//         switch (parsedMessage.type) {
//           case 'signal':
//             handleSignal(ws, parsedMessage);
//             break;
//           case 'join':
//             handleJoin(ws,parsedMessage.uuid, parsedMessage.username);
//             break;
//           case 'chat-message':
//             handleChatMessage(ws, parsedMessage);
//             break;
//           default:
//             console.error('Unknown message type:', parsedMessage.type);
//         }
//       } catch (error) {
//         console.error('Error parsing message:', error);
//       }
//   });

//   ws.on('close', () => {
//     console.log('Client disconnected: ' + ws._socket.remoteAddress + " (" + getUsernameByWs(ws) + ")");
//     // Remove the disconnected client from the map
//     deleteEntryByValue(ws);
//     // Broadcast the updated list of online clients to all connected clients
//     broadcastOnlineUsers();
//   });
// });

// function getUsernameByWs(targetWs){
//   for (let [key, value] of clients.entries()) {
//     if (value === targetWs) {
//       return usernames.get(key);
//     }
//   }
// }

// function deleteEntryByValue(targetValue) {
//     for (let [key, value] of clients.entries()) {
//       if (value === targetValue) {
//         clients.delete(key);
//         usernames.delete(key);
//         break; // Assuming you want to delete only the first matching entry
//       }
//     }
// }

// function handleJoin(ws,uuid,username){
//     clients.set(uuid,ws);
//     usernames.set(uuid,username);
//     console.log("User with username: '" + username + "' and IP: " + ws._socket.remoteAddress + " joined");
//     // Broadcast the list of online clients to all connected clients
//     broadcastOnlineUsers();
// }

// function broadcastOnlineUsers() {
//     // Include the client's IP address in the list
//     clients.forEach((clientws, clientuuid, map) => {
//         if (clientws.readyState === WebSocket.OPEN) {
//             const filteredOnlineUsers = Array.from(clients.keys()).filter((uuid) => uuid !== clientuuid).map((uuid) => [uuid, usernames.get(uuid)]);
//             // Exclude the server's WebSocket instance from the list
//             clientws.send(JSON.stringify({ type: 'onlineUsers', data: filteredOnlineUsers }));
//         }
//     });
// }

// function handleSignal(sender, signalMessage) {
//     const targetUserUUID = signalMessage.to;
//     const senderUserUUID = signalMessage.from;
//     const fileUUID = signalMessage.fileID;
//     const fileName = signalMessage.fileName;
//     // Find the target user's WebSocket connection in the Map
//     const targetUserWs = clients.get(targetUserUUID);

//     if (targetUserWs) {
//         if (targetUserWs.readyState === WebSocket.OPEN) {
//             // Forward the signal data to the target user
//             console.log("Handling send signal to " + usernames.get(targetUserUUID));
//             // console.log(signalMessage);
//             targetUserWs.send(JSON.stringify({ type: 'signal', data: signalMessage.data, to: senderUserUUID, fileID: fileUUID, fileName: fileName}));
//         }
//     } else {
//       console.error(`Target user ${targetUserUUID} not found`);
//     }
// }

// function handleChatMessage(sender, chatMessage) {
//   clients.forEach((clientws, clientuuid) => {
//     if (clientuuid !== chatMessage.uuid) {
//       clientws.send(JSON.stringify(chatMessage));
//     }
//   })
// }

// try {
//   server.listen(config.port, () => {
//     console.log('WebSocket server is running on port ' + config.port.toString());
//   });
// } catch (error) {
//   //for when running on localhost
//   server.listen(3001, () => {
//     console.log('WebSocket server is running on port 3001');
//   });
// }