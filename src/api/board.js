import express from 'express';
import fs from 'node:fs';
import exceljs from 'exceljs';

// Chargement de la configuration d'application
import config from '../config.js';

const router = express.Router();

router.post('/createCampaign', (req, res) => {

    const timestamp = Date.now().toString();
    const newCampaign = {
        campaign: timestamp,
        items: [],
        votants: []
    }
    fs.writeFileSync(`./src/data/campaign_${timestamp}.json`, JSON.stringify(newCampaign));

    return res.json({ status: 'Created', campaign: timestamp });
});

router.get('/campaigns/:id/exportRapportJson', async (req, res) => {

    const campaignId = req.params.id;

    if (!campaignId) {
        return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    const campaignFile = `./src/data/campaign_${campaignId}.json`;

    if (!fs.existsSync(campaignFile)) {
        return res.status(404).json({ error: 'Campaign not found' });
    }

    const content = fs.readFileSync(campaignFile);
    const items = JSON.parse(content).items.sort((a, b) => b.votes - a.votes);

    let id = 0
    const types = ["Pas Cool", "A suivre", "A améliorer", "Réussites"]
    let result = []

    items.filter((item) => item.votes != 0).forEach(item => {
        result.push({
            id: id,
            msg: item.content,
            type: types[item.type - 1],
            nbVotes: item.votes
        })
    });
    
    const filename = `Rapport_de_campagne_${campaignId}.json`

    return res.json({
        filename: filename,
        buffer: Buffer.from(JSON.stringify(result))
    });
});

router.get('/campaigns/:id/exportRapportExcel', async (req, res) => {

    const campaignId = req.params.id;

    if (!campaignId) {
        return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    const campaignFile = `./src/data/campaign_${campaignId}.json`;

    if (!fs.existsSync(campaignFile)) {
        return res.status(404).json({ error: 'Campaign not found' });
    }

    const content = fs.readFileSync(campaignFile);
    const items = JSON.parse(content).items.sort((a, b) => b.votes - a.votes);

    const excelWorkbook = new exceljs.Workbook();

    // excel properties
    excelWorkbook.creator = 'PlockIt';
    excelWorkbook.lastModifiedBy = 'PlockIt';
    excelWorkbook.created = new Date();

    const excelWorkSheet = excelWorkbook.addWorksheet(`${campaignId}`);
    excelWorkSheet.columns = [
        { header: 'Id', key: 'id', width: 5 },
        { header: 'Message', key: 'msg', width: 50 },
        { header: 'Types de messages', key: 'type', width: 20 },
        { header: 'Nombre de vote', key: 'nbVotes', width: 17 }
    ]

    // configuration saut auto ligne
    excelWorkSheet.getColumn('msg').alignment = { wrapText: true }

    let id = 0
    const types = ["Pas Cool", "A suivre", "A améliorer", "Réussites"]

    items.filter((item) => item.votes != 0).forEach(item => {
        excelWorkSheet.addRow({
            id: id,
            msg: item.content,
            type: types[item.type - 1],
            nbVotes: item.votes
        })
    });

    const filename = `Rapport_de_campagne_${campaignId}.xlsx`

    return res.json({ filename: filename, buffer: await excelWorkbook.xlsx.writeBuffer() });
});

router.get('/campaigns/:id/votes', (req, res) => {

    const campaignId = req.params.id;

    if (!campaignId) {
        return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    const campaignFile = `./src/data/campaign_${campaignId}.json`;

    if (!fs.existsSync(campaignFile)) {
        return res.status(404).json({ error: 'Campaign not found' });
    }

    const content = fs.readFileSync(campaignFile);
    const items = JSON.parse(content).items.sort((a, b) => b.votes - a.votes);

    return res.json(items);
});

router.post('/campaigns/:id/resetVotes', (req, res) => {

    const campaignId = req.params.id;

    if (!campaignId) {
        return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    const campaignFile = `./src/data/campaign_${campaignId}.json`;

    if (!fs.existsSync(campaignFile)) {
        return res.status(404).json({ error: 'Campaign not found' });
    }

    const content = JSON.parse(fs.readFileSync(campaignFile));
    content.items.forEach((item) => {
        item.votes = 0;
    })

    fs.writeFileSync(campaignFile, JSON.stringify(content));

    return res.status(200).send({});
});

router.get('/campaigns/:id', (req, res) => {

    const campaignId = req.params.id;
    if (!campaignId) {
        return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    const campaignFile = `./src/data/campaign_${campaignId}.json`;

    if (!fs.existsSync(campaignFile)) {
        return res.status(404).json({ error: 'Campaign not found' });
    }

    const content = fs.readFileSync(campaignFile);
    const json = JSON.parse(content);

    const colMode = Boolean(req.query.col)

    if (colMode) {
        console.log(json.items.filter((item) => item.type == 4));
        const cols = [
            { "name": '<i class="bi bi-file-excel">&nbsp;</i>Pas Cool' ,"items": json.items.filter((item) => item.type == 1)},
            { "name": '<i class="bi bi-eye">&nbsp;</i>A suivre', "items": json.items.filter((item) => item.type == 2)},
            { "name": "A Ameliorer", "items": json.items.filter((item) => item.type == 3)},
            { "name": "Reussites", "items": json.items.filter((item) => item.type == 4)}
        ];
        return res.json({
            campaign: json.campaign,
            cols: cols
        });
    } else {
        return res.json(json);
    }
});

router.get('/campaigns', (req, res) => {

    // Filter and map the campaign files to extract relevant information
    const campaigns = []

    fs.readdirSync('./src/data/').forEach(file => {
        if (file.startsWith('campaign_') && file.endsWith('.json')) {
            campaigns.push(file.replace('campaign_', '').replace('.json', ''));
        }
    });

    // Example response
    return res.json({ campaigns: campaigns });
});

export default router;