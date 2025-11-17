const express = require('express')
const app = express()
const config = require('./config.js')
const fs = require('node:fs');
const cron = require('./api/services/cron.js')

//api modules
const contributeApiModule = require('./api/contribute.js');
const boardApiModule = require('./api/board.js');
const settingsApiModule = require('./api/settings.js');

config.initIPs();
//Initialisation des routines
cron.initCronJobs();

// Middleware to parse JSON bodies
app.use(express.json());
app.set('trust proxy', true);

// Serve back
app.use('/api/board', boardApiModule);
app.use('/api/contribute', contributeApiModule);
app.use('/api/settings', settingsApiModule);

// Serve static files from the "public" directory
app.use('/static', express.static(__dirname + '/front/public'))

// Serve front (HTML pages)

app.get('/', (req, res) => {
    console.log(`GET - ${Date.now().toLocaleString()} - ${req.ip} - /`)
    if (config.secured_mode && !config.security.authorized_ips.includes(req.ip) && !config.security.temporary_authorized_ip.some((ip) => { ip.ip == req.ip })) {
        return res.status(403).sendFile(__dirname + "/front/errors/403.html");
    }
    res.sendFile(__dirname + '/front/index.html');
});

app.get('/err', (req, res) => {
    res.sendFile(__dirname + '/front/errors/500.html')
})

app.get('/credits', (req, res) => {
    if (config.secured_mode && !config.security.authorized_ips.includes(req.ip) && !config.security.temporary_authorized_ip.some((ip) => { ip.ip == req.ip })) {
        return res.status(403).sendFile(__dirname + "/front/errors/403.html");
    }
    res.sendFile(__dirname + '/front/credits.html');
});

app.get('/thanks', (req, res) => {
    if (config.secured_mode && !config.security.authorized_ips.includes(req.ip) && !config.security.temporary_authorized_ip.some((ip) => { ip.ip == req.ip })) {
        return res.status(403).sendFile(__dirname + "/front/errors/403.html");
    }
    res.sendFile(__dirname + '/front/thanks.html');
});

app.get('/ipmanager', (req, res) => {
    if (config.secured_mode && !config.security.authorized_ips.includes(req.ip) && !config.security.temporary_authorized_ip.some((ip) => { ip.ip == req.ip })) {
        return res.status(403).sendFile(__dirname + "/front/errors/403.html");
    }
    res.sendFile(__dirname + '/front/ipmanager.html');
})

app.get('/vote/:id', (req, res) => {
    if (config.secured_mode && !config.security.authorized_ips.includes(req.ip) && !config.security.temporary_authorized_ip.some((ip) => { ip.ip == req.ip })) {
        return res.status(403).sendFile(__dirname + "/front/errors/403.html");
    }
    res.sendFile(__dirname + '/front/vote.html');
});

app.get('/contribute/:id', (req, res) => {
    if (config.secured_mode && !config.security.authorized_ips.includes(req.ip) && !config.security.temporary_authorized_ip.some((ip) => { ip.ip == req.ip })) {
        return res.status(403).sendFile(__dirname + "/front/errors/403.html");
    }
    res.sendFile(__dirname + '/front/contribute.html');
});

app.get('/rapport/:id', (req, res) => {
    if (config.secured_mode && !config.security.authorized_ips.includes(req.ip) && !config.security.temporary_authorized_ip.some((ip) => { ip.ip == req.ip })) {
        return res.status(403).sendFile(__dirname + "/front/errors/403.html");
    }
    res.sendFile(__dirname + '/front/rapport.html');
});

app.get('/:id', (req, res) => {
    const id = req.params.id;
    if (config.secured_mode && !config.security.authorized_ips.includes(req.ip) && !config.security.temporary_authorized_ip.some((ip) => { ip.ip == req.ip })) {
        return res.status(403).sendFile(__dirname + "/front/errors/403.html");
    }

    const campaigns = fs.readdirSync(__dirname + '/data/')
    if (!(id != "" && campaigns.includes(`campaign_${id}.json`))) {
        return res.status(404).sendFile(__dirname + "/front/errors/404.html");
    }

    res.sendFile(__dirname + '/front/index.html');
});

// Envoi des erreurs 404

app.use((req, res, next) => {
    res.status(404).sendFile(__dirname + "/front/errors/404.html")
})

app.listen(config.port, config.host, () => {
    console.log(`PlockIt app listening on ${config.host}:${config.port}`)
})