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

    res.status(200).json({ authorized_ips: config.security.authorized_ips, temporary_authorized_ip: config.security.temporary_authorized_ip });
});

router.post('/askTmpAuthorization', (req, res) => {

    const ip = req.ip;

    if (ip){
        tmpIpQueue.push(req.ip);

        res.status(200).json({ message: "Submitted", total_ip: config.security.temporary_authorized_ip.length })
    } else {
        res.status(400).json({ message: "Request Aborted" })
    }
})

router.post('/tmpAuthorizeIp', (req, res) => {
    if (!req.headers["x-auth-token"] || req.headers["x-auth-token"] !== config.security_token) {
        // Enable secure mode logic here
        res.status(403).json({ status: 'Secure mode enabled', error: "Access Denied" });
    }

    const ip = req.body.ip;

    if (ip && config.security.authorize_temporary_ip){
        const expires_at = new Date();
        expires_at.setDate(expires_at.getDate()+7)
        config.security.authorize_temporary_ip.push({ip : ip, expires_at: expires_at})
    } else {
        res.status(401).json({error:"Can't authorize ip"})
    }
})

export default router;