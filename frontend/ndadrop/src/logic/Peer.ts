export class Peer {
    private UID: string;
    private name: string;
    private selected: boolean;
    private me: boolean;
    private joinedTime: Date;

    //source: https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid 
    public uuidv4() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: any) =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    constructor(name: string, selected: boolean = false, me: boolean = false) {
        this.UID = this.uuidv4();
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