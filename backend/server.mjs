import express from 'express';
import { createServer } from 'http';
import socket from 'socket.io'
import { v4 } from 'uuid';

const app = express();
app.use(express.static('public'))
const io = socket(server);



app.get('/:room', (req, res) => {

})


export const server = createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});
  