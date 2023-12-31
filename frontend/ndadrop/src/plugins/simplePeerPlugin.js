/**
 * @param {boolean} isInitiator - Whether the peer should be the initiator.
 * @param {MediaStream|null} stream - The optional MediaStream.
 * @returns {Promise<SimplePeer.Instance>} - A Promise resolving to the SimplePeer instance.
 */
export function importSimplePeer(isInitiator = false, stream = null) {
  return import('https://cdn.jsdelivr.net/npm/simple-peer@9.11.1/simplepeer.min.js')
    .then(() => {
      // console.log(isInitiator);
      const peerInstance = new SimplePeer({
        initiator: isInitiator,
        stream: stream,      
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            {
              urls: "turn:a.relay.metered.ca:80",
              username: "19dbfbe87f4464e3e24677c7",
              credential: "vRCG6Pbt8DIi3uXu",
            },
            {
              urls: "turn:a.relay.metered.ca:80?transport=tcp",
              username: "19dbfbe87f4464e3e24677c7",
              credential: "vRCG6Pbt8DIi3uXu",
            },
            {
              urls: "turn:a.relay.metered.ca:443",
              username: "19dbfbe87f4464e3e24677c7",
              credential: "vRCG6Pbt8DIi3uXu",
            },
            {
              urls: "turn:a.relay.metered.ca:443?transport=tcp",
              username: "19dbfbe87f4464e3e24677c7",
              credential: "vRCG6Pbt8DIi3uXu",
            },
          ],
        },
      });
      return peerInstance;
    })
    .catch((error) => {
      console.error('Error getting SimplePeer:', error);
      throw error;
    });
}