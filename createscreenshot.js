require('promise.prototype.finally').shim(); // omfg
const webdriverio = require('webdriverio');
const chromedriver = require('chromedriver');
const screenshot = require('wdio-screenshot').makeDocumentScreenshot;
chromedriver.start(['--port=4444'], true).then(() => {
    const client = webdriverio.remote({path: '/', capabilities: {browserName: 'chrome'}});
    return client.init().then(() => client.url('http://127.0.0.1'))
        .then(() => client.getTitle().then(t => console.log('>>> ' + t)))
        .then(() => screenshot(client).then(s => console.log('>>> ' + s.substring(0, 100))))
        .catch(console.log)
        .finally(() => client.end()).catch(() => {});
    
})
.catch(console.log)
.finally(() => chromedriver.stop()).catch(() => {});