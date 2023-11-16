export class File {
    private FileName: string;
    private UID: string;
    private file: any;

    constructor(FileName: string, file: any, UID: string){
        this.FileName = FileName;
        this.UID = UID;
        this.file = file;
    }

    // Getter for FileName
    public getfileName(): string {
        return this.FileName;
    }

    // Getter for UID
    public getuid(): string {
        return this.UID;
    }

    // Getter for file
    public getfile(): any {
        return this.file;
    }
}