import { Server } from 'socket.io';   //nodejs cant identify this syntex that why use type : module in json file
import Connection from './database/db.js';
import { getDocument, updateDocument } from './controller/documentController.js';

const PORT = 9000;
var count = 0;

Connection();

//init socket server
const io = new Server(PORT, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})


//connection create
io.on('connection', socket => {
    console.log('connected', count++);

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


})