const fs = require('fs');
const os = require('os');
const path = require('path');

const { wrapServiceResult } = require('../utils/common');

const socketMap = {}

function monitorFile(socket, lineCount, filePath) {
    try {
        filePath =  filePath || '/Users/kartikjha/Desktop/test-logfile.txt';
        lineCount = lineCount || 10;
        let size = fs.statSync(filePath).size;
        if (socketMap[socket.id] && socketMap[socket.id].filePath == filePath) {
            return;
        }
        socketMap[socket.id] = { filePath, lineCount };
        // fs.watch(filePath, (eventType, fileName) => {
        //     const { getSocketIoInstance } = require('../socket');
        //     const io = getSocketIoInstance();
        //     console.log(eventType + " " + fileName);
        //     if (eventType == 'change') {
        //         let currSize = fs.statSync(filePath).size
        //         let buffer;
        //         if (currSize > size) {
        //             buffer = Buffer(Math.abs(currSize - size));
        //         } else {
        //             size = 0;
        //             buffer = Buffer(currSize)
        //         }
        //         const fileDescriptor = fs.openSync(filePath, 'r');
        //         fs.readSync(fileDescriptor, buffer, 0, buffer.length, size);
        //         size = currSize;
        //         const changes = buffer.toString().split(os.EOL);
        //         changes.pop();
        //         changes.slice(0, lineCount).forEach(line => {
        //             console.log(`${socket.client.sockets.keys().next().value}:${fileName} ${line}`);
        //             socket.send(`${socket.client.sockets.keys().next().value}:${fileName} ${line}`);
        //         })
        //     }
        // });
        fs.watchFile(filePath, (curr, prev) => {
            const { getSocketIoInstance } = require('../socket');
            const io = getSocketIoInstance();
            // console.log(eventType + " " + fileName);
            if (curr.mtimeMs != prev.mtimeMs) {
                let currSize = fs.statSync(filePath).size
                let buffer;
                if (currSize > size) {
                    buffer = Buffer(Math.abs(currSize - size));
                } else {
                    size = 0;
                    buffer = Buffer(currSize)
                }
                const fileDescriptor = fs.openSync(filePath, 'r');
                fs.readSync(fileDescriptor, buffer, 0, buffer.length, size);
                size = currSize;
                const changes = buffer.toString().split(os.EOL);
                changes.pop();
                changes.slice(0, lineCount).forEach(line => {
                    console.log(`${socket.client.sockets.keys().next().value} ${line}`);
                    socket.send(`${socket.client.sockets.keys().next().value} ${line}`);
                })
            }
        });
    } catch (error) {
        return wrapServiceResult(false, `Failed to setup monitor on file ${error.message} ${error.stack}`);
    }
}

module.exports = {
    monitorFile
}