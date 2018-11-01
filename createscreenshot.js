require('promise.prototype.finally').shim(); // omfg
const WebDriver = require('webdriver').WebDriver;
const chromedriver = require('chromedriver');
chromedriver.start(['--port=4444'], true).then(() => {
    return WebDriver.newSession({path: '/', capabilities: {browserName: 'chrome'}}).then((client) => {
        return client.navigateTo('http://127.0.0.1')
            .then(() => client.getTitle().then(t => console.log('>>> ' + t)))
            .catch(console.log)
            .finally(() => client.deleteSession()).catch(() => {});
    });
})
.catch(console.log)
.finally(() => chromedriver.stop()).catch(() => {});