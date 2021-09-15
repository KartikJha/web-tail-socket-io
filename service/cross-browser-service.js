const { supportedBrowser } = require("../constants");

function getExecuteableCommand(path, browser) {
    switch (browser) {
        case supportedBrowser.CHROME:
            return ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [path || 'http://www.nodejs.org']];
        case supportedBrowser.FIREFOX:
            return ['/Applications/Firefox.app/Contents/MacOS/firefox ', [path || 'http://www.nodejs.org']];
        default:
            return [];
    }
}


function removeFilesPath(browser) {
    switch (browser) {
        case supportedBrowser.CHROME:
            return ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [path || 'http://www.nodejs.org']];
        case supportedBrowser.FIREFOX:
            return '/Users/kartikjha/Library/Application\ Support/Firefox/Profiles/ggzcvg4v.default-release';
        default:
            return [];
    }
}

function getSQLiteQueryInterface() {
    return '';
}

function getSessionHistory({browserName, startTime, user}) {
    
}

module.exports = {
    getExecuteableCommand,
    getSQLiteQueryInterface,
    removeFilesPath
}