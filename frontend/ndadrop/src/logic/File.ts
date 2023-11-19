import { useSocketStore } from '@/stores/SocketStore';
import { Peer } from './Peer'
import { usePeersStore } from '@/stores/PeersStore';
import { useFileStore } from '@/stores/FileStore';

export class File {
  private UUID: string;
  private file: any;
  private peer: Peer;
  private sentTime: Date;
  private progress: number;
  public websocket: any;
  private fileName: string = "";

    constructor(UUID: string, file: any, fileName: string, toPeer: Peer, websocket: any, sentTime: Date = new Date(), progress: number = 0) {
      this.UUID = UUID;
      this.file = file;
      this.fileName = fileName;
      this.peer = toPeer;
      this.sentTime = sentTime;
      this.progress = progress;
      this.websocket = websocket;
      this.setupEventListeners();
    }

    public getUID(): string {
      return this.UUID;
    }

    public getFile(): any {
        return this.file;
    }

    public getFileName(): string {
      return this.fileName;
    }

    public getPeer(): Peer {
        return this.peer;
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
        return minutes + " minutes ago";``
    }

    private setupEventListeners() {
      let dataArray: Uint8Array[] = [];
        if (this.websocket) {
            const me = usePeersStore().getMyself;
            // Event: When the peer is signaling to the other peer
            this.websocket.on('signal', (data: any) => {
                // console.log('SIGNAL', JSON.stringify(data));
                const socket: any = useSocketStore().socket;
                if(socket)
                  socket.send(JSON.stringify({ type: 'signal', data: data, to: this.peer.getUID(), from: me.getUID(), fileID: this.UUID, fileName: this.fileName}));
            });
    
          // Event: When the connection is established
          this.websocket.on('connect', () => {
            console.log('File transfer connection established with ' + this.peer.getName() + '.');
            if (this.websocket.initiator){
              this.progress = 0;
              let BUFFER_THRESHOLD = 65535;
              let sendLength = 0;
              const peer = this.websocket;
              const stream = this.file.stream();
              const reader = stream.getReader();

              // Calculate the total size of the file
              const totalFileSize = this.file.size;
              console.log(totalFileSize)
              // Start reading and sending chunks
              readAndSendChunk(this.fileName, this.progress);

              function calculateProgress(sentBytes: number) {
                // Calculate progress as a percentage
                return (sentBytes / totalFileSize) * 100;
              }

              function readAndSendChunk(fileName: string, progress: any) {
                reader.read().then(({ done, value }: { done: boolean; value: Uint8Array }) => {
                  handleReading(done, value, fileName, progress);
                });
              }

              function calculateTimeout(bufferedAmount: number) {
                // Adjust the constants based on your preferences
                const MIN_TIMEOUT = 50; // Minimum timeout in milliseconds
                const MAX_TIMEOUT = 1000; // Maximum timeout in milliseconds
              
                // Calculate a dynamic timeout based on the buffered amount
                const timeout = Math.max(
                  MIN_TIMEOUT,
                  MAX_TIMEOUT - (bufferedAmount / BUFFER_THRESHOLD) * (MAX_TIMEOUT - MIN_TIMEOUT)
                );
              
                return timeout;
              }

              function handleReading(done: boolean, value: Uint8Array, fileName: string, progress: any) {
                if (done) {
                  // Notify the receiver that the file transfer is complete
                  peer.send(JSON.stringify({ done: true, fileName }));
                  reader.releaseLock(); // Release the reader lock when done
                  return;
                }
                // Check bufferedAmount
                const bufferedAmount = peer._channel.bufferedAmount;
                // console.log('Buffered amount:', bufferedAmount);
                sendLength = sendLength + (value.length/2);
                // Update progress based on the amount of data sent                  
                progress = calculateProgress(sendLength);
                console.log(progress);
                console.log(sendLength)
                
                // If bufferedAmount is greater than or equal to the threshold, wait and retry
                if (bufferedAmount >= BUFFER_THRESHOLD) {
                  const timeout = calculateTimeout(bufferedAmount);

                  setTimeout(() => {
                    handleReading(done, value, fileName, progress);
                  }, timeout);

                  return;
                }

                // Send the current chunk
                if (value.length > BUFFER_THRESHOLD){
                  for (let index = 0;index < value.length;index += BUFFER_THRESHOLD) {
                    let slicedValue = value.slice(index, index + BUFFER_THRESHOLD);
                    peer.send(slicedValue);
                    // console.log(slicedValue.length)
                  }
                } else {
                  peer.send(value);
                }
                // console.log('Buffered amount:', peer._channel.bufferedAmount);

                // Read and send the next chunk
                readAndSendChunk(fileName, progress);
              }
              this.progress = 100;

            } else {
              
            }
          });
    
          // Event: When data is received from the other peer
          this.websocket.on('data', (data: any) => {
            // console.log('DATA', data.toString());
            if (!this.websocket.initiator){
              this.progress = 0;
              // console.log("Data: ", data.length);
              if (data.toString().includes("done")) {
                  // setGotFile(true);
                  const parsed = JSON.parse(data);
                  this.fileName = parsed.fileName;
                  // Concatenate all the chunks into a single Uint8Array
                  const concatenatedArray = new Uint8Array(
                    dataArray.reduce((acc, chunk) => acc.concat(Array.from(chunk) as number[]), [] as number[])
                  );      
                  // console.log(dataArray);            
                  const blob = new Blob([concatenatedArray], { type: 'application/octet-stream' });
                  const downloadLink = document.createElement('a');
                  downloadLink.href = URL.createObjectURL(blob);
                  downloadLink.download = this.fileName;
                  downloadLink.click();
                  downloadLink.remove();
                  this.websocket.destroy();
                  dataArray = [];
              } else {
                dataArray.push(new Uint8Array(data));
              }
            }

          });
    
          // Event: When the connection is closed
          this.websocket.on('close', () => {
            console.log('File transfer with ' + this.peer.getName() + ' completed, connection closed.');
            this.progress = 100;
            useFileStore().removeFileOnUUID(this.UUID);
          });
    
          // Event: When an error occurs
          this.websocket.on('error', (err:any ) => {
            console.error('ERROR', err);
            useFileStore().removeFileOnUUID(this.UUID);
            this.websocket.destroy();
          });
        }
      }
}