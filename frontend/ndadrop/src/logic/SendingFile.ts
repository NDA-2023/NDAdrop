import { useSocketStore } from '@/stores/SocketStore';
import { Peer } from './Peer'
import { usePeersStore } from '@/stores/PeersStore';
import { useFileStore } from '@/stores/FileStore';
import type { File } from './File';

export class SendingFile {
    private file: any;
    private toPeer: Peer;
    private sentTime: Date;
    private progress: number;
    private toWebsocket: any;
    private fileName: string;

    constructor(file: any, toPeer: Peer, websocket: any, sentTime: Date = new Date(), progress: number = 0) {
        this.file = file;
        this.fileName = file.name;
        this.toPeer = toPeer;
        this.sentTime = sentTime;
        this.progress = progress;
        this.toWebsocket = websocket;
        this.setupEventListeners();
        console.log(this.fileName);
    }

    public getFile(): File {
        return this.file;
    }

    public getFileName(): string {
      return this.fileName;
    }

    public getPeer(): Peer {
        return this.toPeer;
    }

    public getSentTime(): Date {
        return this.sentTime;
    }

    public getProgress(): number {
        return this.progress
    }

    public setProgress(progress: number) {
        this.progress = progress;
    }

    public timeAgo(): string {
        let timeSince = new Date().getTime() - this.sentTime.getTime();
        const duration = new Date(timeSince);
        const minutes = duration.getMinutes();
        if (minutes <= 0) 
            return duration.getSeconds() + " seconds ago";
        return minutes + " minutes ago";
    }

    private setupEventListeners() {
        if (this.toWebsocket) {
            const me = usePeersStore().getMyself;
            // Event: When the peer is signaling to the other peer
            this.toWebsocket.on('signal', (data: any) => {
                console.log('SIGNAL', JSON.stringify(data));
                const socket = useSocketStore().socket;
                console.log(this.file.getuid());
                if(socket)
                  socket.send(JSON.stringify({ type: 'signal', data: data, to: this.toPeer.getUID(), from: me.getUID(), fileID: this.file.getuid()}));
            });
    
          // Event: When the connection is established
          this.toWebsocket.on('connect', () => {
            console.log('CONNECTED');
            
            // Now you can start sending and receiving data
          });
    
          // Event: When data is received from the other peer
          this.toWebsocket.on('data', (data: any) => {
            console.log('DATA', data.toString());
          });
    
          // Event: When the connection is closed
          this.toWebsocket.on('close', () => {
            console.log('CONNECTION CLOSED');
          });
    
          // Event: When an error occurs
          this.toWebsocket.on('error', (err:any ) => {
            console.error('ERROR', err);
          });
        }
      }
}