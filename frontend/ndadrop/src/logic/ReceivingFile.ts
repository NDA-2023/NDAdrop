import { useSocketStore } from '@/stores/SocketStore';
import { Peer } from './Peer'
import { usePeersStore } from '@/stores/PeersStore';
import type { File } from './File';

export class ReceivingFile {
    private fromPeer: Peer;
    private arriveTime: Date;
    private websocket: any;

    constructor(fromPeer: Peer, websocket: any, arriveTime: Date = new Date(), progress: number = 0) {
        this.fromPeer = fromPeer;
        this.arriveTime = arriveTime;
        this.websocket = websocket;
        this.setupEventListeners();
    }

    // public getFileName(): string {
    //     return this.fileName;
    // }

    public getPeer(): Peer {
        return this.fromPeer;
    }

    public getArriveTime(): Date {
        return this.arriveTime;
    }

    public timeAgo(): string {
        let timeSince = new Date().getTime() - this.arriveTime.getTime();
        const duration = new Date(timeSince);
        const minutes = duration.getMinutes();
        if (minutes <= 0) 
            return duration.getSeconds() + " seconds ago";
        return minutes + " minutes ago";
    }

    private setupEventListeners() {
        if (this.websocket) {
            const me = usePeersStore().getMyself;
            // Event: When the peer is signaling to the other peer
            this.websocket.on('signal', (data: any) => {
                console.log('SIGNAL', JSON.stringify(data));
                const socket = useSocketStore().socket;
                if(socket)
                socket.send(JSON.stringify({ type: 'signal', data: data, to: this.fromPeer.getUID(), from: me.getUID()}));
            });
    
          // Event: When the connection is established
          this.websocket.on('connect', () => {
            console.log('CONNECTED');
            // Now you can start sending and receiving data
          });
    
          // Event: When data is received from the other peer
          this.websocket.on('data', (data: any) => {
            console.log('DATA', data.toString());
          });
    
          // Event: When the connection is closed
          this.websocket.on('close', () => {
            console.log('CONNECTION CLOSED');
          });
    
          // Event: When an error occurs
          this.websocket.on('error', (err:any ) => {
            console.error('ERROR', err);
          });
        }
      }
}