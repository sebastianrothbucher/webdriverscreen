// some config
const URL = 'http://127.0.0.1';
const THRESHOLD = 0.001; // 0.1% of pixels or more are different produce a warning / non-0 exit
const LOADTIME = 1000; // ms: wait so long for the page to load before capturing the screen
const SCREENWIDTH = -1; // >0 to set screen size
const REFSCREEN = 'refscreen'; // .png
const FUZZ = 10; // % (how much difference in color we tolerate)
// (the program)
require('promise.prototype.finally').shim(); // omfg
const fs = require('fs');
const dateformat = require('dateformat');
const exec = require('child_process').exec;
const webdriverio = require('webdriverio');
const chromedriver = require('chromedriver');
const screenshot = require('wdio-screenshot').makeDocumentScreenshot;
const regex = /all: \d+\.?\d* \((\d\.\d*(e-?\+?\d+)?)\)/; // pull the match out of magick
var returncode = 0;
chromedriver.start(['--port=4444'], true).then(() => {
    const client = webdriverio.remote({path: '/', capabilities: {browserName: 'chrome'}});
    return client.init().then(() => client.url(URL))
        .then(() => SCREENWIDTH > 0 ? client.setViewportSize({width: SCREENWIDTH, height: 800}) : null) // height does not matter, really
        .then(() => new Promise((resolve) => setTimeout(resolve, LOADTIME)))
        .then(() => client.getTitle().then(t => console.log('>>> title: ' + t))) // just 4 info
        .then(() => screenshot(client).then(s => { // write screen file
            const filename = 'screen_' + dateformat(new Date(), 'yyyymmdd_HHMMss');
            return (new Promise((resolve, reject) => {
                fs.writeFile(filename + '.png', Buffer.from(s, 'base64'), (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            }))
            .then(() => console.log('>>> Screenshot ' + filename + '.png written'))
            .then(() => filename); // use as fn below
        }))
        .then((fn) => { // create the diff as such (when we have a screen)
            const hasRef = fs.existsSync(REFSCREEN + '.png');
            if (fn && hasRef) {
                return new Promise((resolve, reject) => {
                    exec('magick compare -verbose -metric MAE -fuzz 10% ' + REFSCREEN + '.png ' + fn + '.png ' + fn + '_diff.png', (err, stdout, stderr) => {
                        const res = stderr.toString(); // magick just does it that way
                        if (err && err.code !== 1) { // 1 just means: some minor diff
                            console.error(res);
                            reject(err);
                        }
                        console.log(res);
                        resolve(res);
                    });
                });
            } else if (fn && (!hasRef)) {
                console.info('>>> Create ' + REFSCREEN + '.png to compare!');
            }
        })
        .then((diffres) => { // interpret the diff res (when we have one)
            if (diffres && diffres.match(regex)) {
                const diff = parseFloat(diffres.match(regex)[1]);
                if (diff > THRESHOLD) {
                    console.error('>>> surpass threshold of ' + THRESHOLD + ' by ' + Math.round(diff * 100 / THRESHOLD) + '% - we have ' + diff);
                    returncode = 1;
                } else {
                    console.log('>>> diff within limits - we have ' + diff);
                }
            } else if (diffres && (!diffres.match(regex))) {
                console.warn('>>> sth is strange with the magick result - can\'t use');
                returncode = 2; // also fail (don't have accidential whites)
            }
        })
        .catch(console.error)
        .finally(() => client.end()).catch(() => {});
})
.catch(console.error)
.finally(() => chromedriver.stop()).catch(() => {})
.then(() => process.exit(returncode)); // exit non-zero when above threshold