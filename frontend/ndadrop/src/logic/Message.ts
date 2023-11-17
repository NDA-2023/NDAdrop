import { DateTime } from 'luxon';
import { Peer } from './Peer'

export class Message {
    private peer: Peer;
    private contents: string;
    private sentTime: DateTime;

    constructor(peer: Peer, contents: string, timestamp: DateTime | null = null) {
        this.peer = peer;
        this.contents = contents;
        this.sentTime = timestamp === null ? DateTime.now() : timestamp;
    }

    public getPeer(): Peer {
        return this.peer;
    }

    public getContents(): string {
        return this.contents;
    }

    public getTimestamp(): DateTime {
        return this.sentTime;
    }

}