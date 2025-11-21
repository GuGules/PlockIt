const express = require('express');
const fs = require('node:fs');
const { hash } = require('./services/crypto');

//Chargement de la config de l'application
const config = require('../config.js');

const router = express.Router();

router.post('/:id', (req, res) => {
    const campaignId = req.params.id;
    const itemData = req.body;

    if (config.security.secured_mode && !config.security.authorized_ips.includes(req.ip) && !config.security.temporary_authorized_ip.some((ip)=>{ip.ip == req.ip})){
        return res.status(403).json({ error: 'Forbidden' });
    }

    if (!campaignId) {
        return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    if (!itemData){
        return res.status(400).json({ error: 'Requête incorrecte: le post n\'a pas été envoyé' });
    }

    const campaignFile = `./src/data/campaign_${campaignId}.json`;

    if (!fs.existsSync(campaignFile)) {
        return res.status(404).json({ error: 'Campaign not found' });
    }

    const campaignData = JSON.parse(fs.readFileSync(campaignFile));

    hash(itemData.content).then((id) => {
        itemData.id = id;
        itemData.votes = 0;
    
        campaignData.items.push(itemData);

        fs.writeFileSync(campaignFile, JSON.stringify(campaignData));

        res.json({ campaign: campaignData });
    })
});

router.post('/vote/:id', (req, res) => {
    const campaignId = req.params.id;
    const selectedItems = req.body.selectedItems;
    const session_id = req.body.session_id

    if (config.security.secured_mode && !config.security.authorized_ips.includes(req.ip) && !config.security.temporary_authorized_ip.some((ip)=> ip.ip == req.ip)){
        return res.status(403).json({ error: 'Forbidden' });
    }

    if (!campaignId) {
        return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    const campaignFile = `./src/data/campaign_${campaignId}.json`;

    if (!fs.existsSync(campaignFile)) {
        return res.status(404).json({ error: 'Campaign not found' });
    }

    const campaignData = JSON.parse(fs.readFileSync(campaignFile));

    if (campaignData.votants.includes(session_id)){
        return res.status(403).json({ error: 'Le vote a déjà été soumis' });
    }

    selectedItems.forEach(selectedId => {
        campaignData.items.find(i => i.id === selectedId).votes += 1;
    });

    campaignData.votants.push(session_id)

    fs.writeFileSync(campaignFile, JSON.stringify(campaignData));

    res.json({ campaign: campaignData });
});

module.exports = router;