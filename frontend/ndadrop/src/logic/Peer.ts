export class Peer {
    private name: string;
    private selected: boolean;
    private me: boolean;
    private joinedTime: Date;

    constructor(name: string, selected: boolean = false, me: boolean = false) {
        this.name = name;
        this.me = me
        this.selected = false;
        if (!this.me)
            this.selected = selected;
        this.joinedTime = new Date();
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