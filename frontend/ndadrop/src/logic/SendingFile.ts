import { Peer } from './Peer'

export class SendingFile {
    private fileName: String;
    private toPeer: Peer;
    private sentTime: Date;
    private progress: number;

    constructor(fileName: string, toPeer: Peer, sentTime: Date = new Date(), progress: number = 0) {
        this.fileName = fileName;
        this.toPeer = toPeer;
        this.sentTime = sentTime;
        this.progress = progress;
    }

    public getFileName(): String {
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
}