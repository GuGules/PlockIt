import express from 'express';

const tmpIpQueue = [];

// Chargement de la config
import config from '../config.js';

const router = express.Router();

router.post('/enableSecureMode', (req, res) => {
    // Example response
    if (req.headers['x-auth-token'] && req.headers['x-auth-token'] !== config.security_token) {
        // Enable secure mode logic here
        return res.status(403).json({ error: 'Forbidden' });
    }

    if (config.security.secured_mode) {
        res.json({ status: 'Secure mode already enabled' });
    } else {
        config.security.secured_mode = true;
        res.json({ status: 'Secure mode enabled' });
    }

});

router.get('/ip', (req, res) => {
    res.status(200).json({ ip: req.ip })
})

router.post('/disableSecureMode', (req, res) => {
    // Example response
    if (config.security.secured_mode && req.headers["x-auth-token"] && req.headers["x-auth-token"] === config.security_token) {
        // Enable secure mode logic here
        config.security.secured_mode = false;
        res.json({ status: 'Secure mode disabled' });
    } else {
        res.status(403).json({ error: 'Forbidden' });
    }
});

router.put('/authorizeIPs', (req, res) => {
    const authorizedIPs = req.body.ips;

    if (!req.headers["x-auth-token"] || req.headers["x-auth-token"] !== config.security_token) {
        // Enable secure mode logic here
        res.json({ status: 'Secure mode enabled' });
    }

    if (!Array.isArray(authorizedIPs)) {
        return res.status(400).json({ error: 'Invalid IPs format' });
    }

    // Here you would typically update your configuration or database
    config.security.authorized_ips.push(...authorizedIPs);

    res.json({ status: 'Authorized IPs updated', authorized_ips: config.authorized_ips });
});

router.get('/authorizedIPs', (req, res) => {

    if (!req.headers["x-auth-token"] || req.headers["x-auth-token"] !== config.security_token) {
        // Enable secure mode logic here
        res.status(403).json({ status: 'Secure mode enabled', message: 'Forbidden' });
    }

    res.status(200).json([...config.security.authorized_ips.map((item) => { return{ip: item,temp: false}}),...config.security.temporary_authorized_ip.map((item) => { return{ip: item,temp: true}})]);
});

router.post('/askTmpAuthorization', (req, res) => {

    const ip = req.ip;
    const message = req.body.message;

    if (ip){
        tmpIpQueue.push({ip:req.ip,identification : message});

        res.status(200).json({ message: "Submitted", total_ip: config.security.temporary_authorized_ip.length });
    } else {
        res.status(400).json({ message: "Request Aborted" })
    }
})

router.post('/tmpAuthorizationApprove', (req, res) => {
    if (!req.headers["x-auth-token"] || req.headers["x-auth-token"] !== config.security_token) {
        // Enable secure mode logic here
        res.status(403).json({ status: 'Secure mode enabled', error: "Access Denied" });
    }

    const ip = req.body.ip;
    const identification = req.body.identification;

    if (ip){
        if (tmpIpQueue.includes(item => item.ip == ip)){
            tmpIpQueue = tmpIpQueue.filter(item => item.ip != ip)
            config.security.temporary_authorized_ip.push({ip: ip, expires_at: new Date().setDate(new Date(Date.now()).getDate()+7), identification: identification});
            res.status(204);
        } else {
            res.status(404);
        }
    } else {
        res.status(400)
    }
})

router.get('/ipqueue', (req, res) => {
    if (!req.headers["x-auth-token"] || req.headers["x-auth-token"] !== config.security_token) {
        // Enable secure mode logic here
        res.status(403).json({ status: 'Secure mode enabled', error: "Access Denied" });
    }

    res.status(200).json({queue:tmpIpQueue})
})

export default router;