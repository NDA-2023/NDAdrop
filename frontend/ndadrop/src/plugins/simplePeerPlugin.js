// const SimplePeerPlugin = {
//     install(app) {
//       import('https://cdn.jsdelivr.net/npm/simple-peer@9.11.1/simplepeer.min.js').then(() => {
//         // console.log(module)
//         // Use named export (e.g., SimplePeer)
//         const SimplePeer = module.Peer;
//         // // Ensure it's a constructor
//         // if (typeof SimplePeer !== 'function') {
//         //   console.error('SimplePeer is not a constructor.');
//         //   return;
//         // }
//         // Now you can use SimplePeer as a constructor
//         // const peer = new SimplePeer();

//         // You can expose the peer instance if needed
//         app.config.globalProperties.$SimplePeer = SimplePeer;
//       }).catch((error) => {
//         console.error('Error loading SimplePeer:', error);
//       });
//     },
//   };

// export default SimplePeerPlugin;
export function importSimplePeer() {
  return import('https://cdn.jsdelivr.net/npm/simple-peer@9.11.1/simplepeer.min.js')
    .then(() => {
      const peerInstance = new SimplePeer({ initiator: true });
      return peerInstance;
    })
    .catch((error) => {
      console.error('Error getting SimplePeer:', error);
      throw error;
    });
}