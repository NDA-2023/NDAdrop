import { useSocketStore } from '../stores/SocketStore';

export class Peer {
    private UID: string;
    private name: string;
    private selected: boolean;
    private me: boolean;
    private joinedTime: Date;
    private listeningSocket: any;//-> lijst van sender/receiver threads per persoon

    //source: https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid 
    public uuidv4() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: any) =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
 
    constructor(UUID:string,name: string, selected: boolean = false, me: boolean = false, websocket: any = null) {
        if (UUID.length == 0)
          this.UID = this.uuidv4();
        else
          this.UID = UUID;
        this.name = name;
        this.me = me
        this.selected = false;
        if (!this.me)
            this.selected = selected;
        this.joinedTime = new Date();
        this.listeningSocket = websocket;
        // Set up event listeners
        // this.setupEventListeners();
    }

    private setupEventListeners() {
        if (this.listeningSocket) {
          // Event: When the peer is signaling to the other peer
          this.listeningSocket.on('signal', (data: any) => {
            console.log('SIGNAL', JSON.stringify(data));
            const socket = useSocketStore().socket;
            if(socket)
              socket.send(JSON.stringify({ type: 'signal', data: data, to: "Test1", from: this.UID}));
          });
    
          // Event: When the connection is established
          this.listeningSocket.on('connect', () => {
            console.log('CONNECTED');
            // Now you can start sending and receiving data
          });
    
          // Event: When data is received from the other peer
          this.listeningSocket.on('data', (data: any) => {
            console.log('DATA', data.toString());
          });
    
          // Event: When the connection is closed
          this.listeningSocket.on('close', () => {
            console.log('CONNECTION CLOSED');
          });
    
          // Event: When an error occurs
          this.listeningSocket.on('error', (err:any ) => {
            console.error('ERROR', err);
          });
        }
      }

    public getUID(): string {
        return this.UID
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public isSelected(): boolean {
        return this.selected;
    }

    public setSelected(selected: boolean): void {
        if (!this.me)
            this.selected = selected;
    }

    public isMe(): boolean {
        return this.me;
    }

    public getJoinedTime(): Date {
        return this.joinedTime;
    }
}