import { usePeersStore } from "@/stores/PeersStore";
import type { Peer } from "./Peer";
import { v1 as uuid } from 'uuid';
import { useSocketStore } from "@/stores/SocketStore";
import { useScreenShareStore } from "@/stores/ScreenShareStore";

export class ScreenShare {
    private UID: string;
    private peer: Peer;
    public websocket: any;
    public hasStream: boolean = false;
    public stream: any = null;
  
    constructor(UUID:string, toPeer: Peer, websocket: any) {
        if (UUID.length == 0)
            this.UID = uuid();
        else
            this.UID = UUID;
        this.peer = toPeer;
        this.websocket = websocket;
        this.setupEventListeners();
    } 

    public getUUID(): string {
        return this.UID;
    }

    public getPeer(): Peer {
        return this.peer;
    }

    private setupEventListeners() {
        if (this.websocket) {
            const me = usePeersStore().getMyself;
            
            this.websocket.on('signal', (data: any) => {
                // console.log('SIGNAL', JSON.stringify(data));
                const socket: any = useSocketStore().socket;
                if(socket)
                  socket.send(JSON.stringify({ type: 'signal', data: data, to: this.peer.getUID(), from: me.getUID(), screenShareID: this.UID}));
            });
            
            // Event: When the connection is established
            this.websocket.on('connect', () => {
                console.log('Video connection established with ' + this.peer.getName() + '.');
                
            });

            // Handle stream events
            this.websocket.on('stream', (stream: any) => {
                // console.log(stream);
                if (!this.websocket.initiator){
                    this.stream = stream;
                    this.hasStream = true;
                }
            });
        
            // Event: When the connection is closed
            this.websocket.on('close', () => {
                console.log('Video share ended with ' + this.peer.getName() + ', connection closed.');
                this.websocket.stream = null;
                if (this.stream)
                    this.stream.getTracks().forEach((track: any) => track.stop());
                useScreenShareStore().removeScreenShareOnUUID(this.UID);
            });
        
            // Event: When an error occurs
            this.websocket.on('error', (err:any ) => {
                console.error('ERROR', err);
                useScreenShareStore().removeScreenShareOnUUID(this.UID);
                this.websocket.destroy();
            });
        }
    }
}