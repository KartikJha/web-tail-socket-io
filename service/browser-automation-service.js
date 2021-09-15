// const { isEmpty, get, wrap } = require("lodash");
const { wrapServiceResult } = require("../utils/common");
// const messages = require("../utils/messages");
const { supportedBrowserList} = require("../constants");
const { spawn, execSync, exec } = require('child_process');
const { getExecuteableCommand, getSessionHistory, removeFilesPath } = require('./cross-browser-service');
// const 

const browserProcessPool = {};

async function closeHandler(err, stdout, stderr) {
    console.log(err.message);
    console.log(stdout);
    console.log(stderr);
}

async function stdOutHandler(data) {
    console.log(data);
    return data;
}

async function stdErrHandler(data) {
    console.log(data);
    return data;
}

async function openBrowser({
    path = "",
    browserName = "",
    url = "",
    user,
    browser
}) {
    if (!browserName || !supportedBrowserList.find(e => e === browserName)) {
        return wrapServiceResult(null, `Browser name should be ${supportedBrowserList.join(' ,')}`)
    }
    const executableCommand = getExecuteableCommand(path, browserName);
    const cp = spawn(...executableCommand, { detached: true });
    cp.on('close', closeHandler);
    cp.stdout.on('data', stdOutHandler);
    browserProcessPool[cp.pid] = { startTime: Date.now(), user, browserName };
    return wrapServiceResult(`${browserName}:${cp.pid}`, []);
}


async function closeBrowser({browserProcessId}) {
    if (!browserProcessId) {
        return wrapServiceResult(null, `Browser processId needed`);
    }
    try {
        process.kill(browserProcessId);
    } catch (error) {
        return wrapServiceResult(null, `Failed to stop browser pid ${browserProcessId}`);
    }
    return wrapServiceResult({closed: true}, []);
}

async function cleanupBrowser({browserName}) {
    if (!browserName || !supportedBrowserList.find(e => e === browserName)) {
        return wrapServiceResult(null, `Browser name should be ${supportedBrowserList.join(' ,')}`)
    }
    try {
        const out = execSync(`killall '${browserName}'`);
    } catch (error) {
        console.log(error.message + " " + error.stack);
    }
    const pathForDeletion = removeFilesPath(browserName);
    const files = execSync(`ls '${pathForDeletion}' | grep sqlite`);
    files.toString().split('\n').forEach(file => {
        try {
            const rmOut = execSync(`cd '${pathForDeletion}' && rm ${file} && touch ${file}`);
            console.log(rmOut.toString());
        }
        catch (error) {
            console.log(error.message + "  " + error.stack);
        }
    })
    console.log(files.toString());
    return wrapServiceResult({cleanedUp: true}, []);
}



module.exports = {
    openBrowser,
    closeBrowser,
    cleanupBrowser
}