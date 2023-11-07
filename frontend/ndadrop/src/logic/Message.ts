import { Peer } from './Peer'

export class Message {
    private peer: Peer;
    private contents: string;
    private sentTime: Date;

    constructor(peer: Peer, contents: string, timestamp: Date | null = null) {
        this.peer = peer;
        this.contents = contents;
        this.sentTime = timestamp === null ? new Date() : timestamp;
    }

    public getPeer(): Peer {
        return this.peer;
    }

    public getContents(): string {
        return this.contents;
    }

    public getTimestamp(): Date {
        return this.sentTime;
    }

}