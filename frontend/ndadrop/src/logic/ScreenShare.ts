import { usePeersStore } from "@/stores/PeersStore";
import type { Peer } from "./Peer";
import { v1 as uuid } from 'uuid';
import { useSocketStore } from "@/stores/SocketStore";
import { useScreenShareStore } from "@/stores/ScreenShareStore";

export class ScreenShare {
    private UID: string;
    private peer: Peer;
    public websocket: any;
    private videoPlayer: any;
  
    constructor(UUID:string, toPeer: Peer, websocket: any, videoPlayer: any) {
        if (UUID.length == 0)
            this.UID = uuid();
        else
            this.UID = UUID;
        this.peer = toPeer;
        console.log(videoPlayer);
        this.videoPlayer = videoPlayer;
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
        let dataArray: Uint8Array[] = [];
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
                console.log('Connection established.');
                
            });

                // Handle stream events
            this.websocket.on('stream', (stream: any) => {
                console.log(stream);
                if (!this.websocket.initiator){
                    this.videoPlayer.srcObject = stream;
                }
                this.videoPlayer.play()
                // Handle incoming stream (remote stream)
                // this.$refs.remoteStream.srcObject = stream;
            });
        
            // Event: When data is received from the other peer
            this.websocket.on('data', (data: any) => {
                // console.log('DATA', data.toString());
                

            });
        
            // Event: When the connection is closed
            this.websocket.on('close', () => {
                console.log('Connection closed, screen share ended.');
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