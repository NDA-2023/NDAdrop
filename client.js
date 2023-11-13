const SimplePeer = require('simple-peer');
const isSender = false; // Set to false for the receiver
const peer = new SimplePeer({ initiator: isSender });


peer.on('signal', (data) => {
    console.log('Peer signal:', data);

    // Send the signal data to the other peer using a local method (e.g., over UDP or any other local protocol)
    // Your implementation here, could involve local network communication
    ws.send(JSON.stringify({ type: 'signal', data: signalData, to: otherUserId }));
});

peer.on('connect', () => {
  console.log('Peer connected');

//   if (isSender) {
//     // Initiating as the sender
//     startFileTransfer();
//   }
});

peer.on('data', (data) => {
  console.log('Received data from peer:', data);

  // Your logic for handling incoming data
});


function startFileTransfer(otherUserId) {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  isSender = true
  peer = new SimplePeer({ initiator: isSender });
    console.log(otherUserId)
  if (file) {
    // Send the file data to the other peer
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result;
    //   peer.send(content);
    };
    reader.readAsDataURL(file);
  } else {
    console.error('Please select a file.');
  }
}
