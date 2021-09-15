const { monitorFile } = require('./service/file-watcher-service');

let io;

function getSocketIoInstance(httpServer) {
    if (io) {
        return io;
    }
    io = require('socket.io')(httpServer);
    io.on('connection', socket => {
        socket.send(`Hello ${socket.client.sockets.keys().next().value}`);
        socket.on('monitor', (filePath, lineCount) => {
            monitorFile(socket, lineCount, filePath);
        });
    })
    return io;
}

module.exports = {
    getSocketIoInstance
}