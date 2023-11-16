import { useSocketStore } from '../stores/SocketStore';
import { v1 as uuid } from 'uuid';

export class Peer {
    private UID: string;
    private name: string;
    private selected: boolean;
    private me: boolean;
    private joinedTime: Date;
 
    constructor(UUID:string,name: string, selected: boolean = false, me: boolean = false) {
        if (UUID.length == 0)
          this.UID = uuid();
        else
          this.UID = UUID;
        this.name = name;
        this.me = me
        this.selected = false;
        if (!this.me)
            this.selected = selected;
        this.joinedTime = new Date();
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