export function importSimplePeer(isInitiator = false) {
  return import('https://cdn.jsdelivr.net/npm/simple-peer@9.11.1/simplepeer.min.js')
    .then(() => {
      // console.log(isInitiator);
      const peerInstance = new SimplePeer({ initiator: isInitiator });
      return peerInstance;
    })
    .catch((error) => {
      console.error('Error getting SimplePeer:', error);
      throw error;
    });
}