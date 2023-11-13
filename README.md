# NDAdrop Backend

## Requirements

* NodeJS
* Websocket library
* http library

## Run the Signaling Server

```bash
node server.js
```

## Run the Frontend Server

```bash
node index.js
```

#####!Works only for txt files!

in index.html change this line:     
 ```js
 const ws = new WebSocket('ws://192.168.1.196:3001');
 ```
 to
  ```js
 const ws = new WebSocket('ws://<your ip or localhost>:3001');
 ```

