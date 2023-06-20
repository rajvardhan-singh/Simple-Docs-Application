import { Server } from 'socket.io';   //nodejs cant identify this syntex that why use type : module in json file
import express from 'express';
import Connection from './database/db.js';
import { getDocument, updateDocument } from './controller/documentController.js';
import path from 'path';

const _dirname = path.resolve();

const PORT = process.env.PORT || 7000;

//coe for depolyment
const app = express();
app.use(express.static(path.join("_dirname", "./client/build")))
app.get('*', function (_, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"), function (err) {
        res.status(500).send(err);
    })
})


Connection();

//init socket server
const io = new Server(PORT, {
    cors: {
        origin: '',
        methods: ['GET', 'POST']
    }
})


//connection create
io.on('connection', socket => {
    try {
        console.log('connected');

        socket.on('get-document', async documentId => {
            console.log('recieve get documnet event...');
            const document = await getDocument(documentId)
            socket.join(documentId);
            socket.emit('load-document', document.data)
            console.log('emit load-documnet event...');

            socket.on('send-changes', delta => {
                console.log(delta);
                socket.broadcast.to(documentId).emit('receive-change', delta);
            })

            socket.on('save-document', async data => {
                await updateDocument(documentId, data)
            })
        })
    } catch (error) {
        console.log(error);
    }

})