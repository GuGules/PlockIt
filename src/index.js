import express from "express";
const app = express();
import config from './config.js'
import fs, { cp } from 'node:fs';
import cron from './api/services/cron.js';
import demoMode from './api/services/demomode.js'
import chalk from "chalk";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//api modules
import contributeApiModule from './api/contribute.js';
import boardApiModule from './api/board.js';
import settingsApiModule from './api/settings.js';
import healthApiModule from './api/health.js'

config.initIPs();
//Initialisation des routines
cron.initCronJobs();

// Middleware to parse JSON bodies
app.use(express.json());
app.set('trust proxy', true);

if (!config.security.demo_mode){
    app.use('/api/settings', settingsApiModule); // Protected by token authentification
}else {
    config.security.secured_mode = false; // Désactivation du mode sécurisé en mode démo

    if (!fs.existsSync(`./src/data/campaign_demo.json`)){   
        // Création de la campagne de démo
        const demoCampaign = { 
            campaign: "demo",
            items: [],
            votants: []
        }
        fs.writeFileSync(`./src/data/campaign_demo.json`, JSON.stringify(demoCampaign));
    }
}
app.use('/api/health', healthApiModule); // Used by kubernetes instances

// Serve static files from the "public" directory
app.use('/static', express.static(__dirname + '/front/public'))

// Security Middleware
app.use((req,res,next)=>{
    if (config.security.secured_mode && !config.security.authorized_ips.includes(req.ip) && !config.security.temporary_authorized_ip.some((ip) => { ip.ip == req.ip })) {
        console.log(chalk.red(`[${new Date().toISOString()}] ${req.method} - ${req.path}`))
        return res.status(403).sendFile(__dirname + `/front/errors/403${config.security.authorize_temporary_ip? "" : "_strict"}.html`);
    } else {
        console.log(chalk.green(`[${new Date().toISOString()}] ${req.ip} - ${req.method} - ${req.path}`));
        next();
    }
})

// Serve back
app.use('/api/board', boardApiModule);
app.use('/api/contribute', contributeApiModule);

// Serve front (HTML pages)

app.get('/', (req, res) => {
    const col_mode = Boolean(req.query.col);
    if (config.security.demo_mode){
        return res.redirect('/demo')
    }

    if(col_mode){
        return res.sendFile(__dirname + '/front/col.html')
    } else {
        return res.sendFile(__dirname + '/front/index.html');
    }
});

app.get('/err', (req, res) => {
    res.sendFile(__dirname + '/front/errors/500.html')
})

app.get('/credits', (req, res) => {
    res.sendFile(__dirname + '/front/credits.html');
});

app.get('/thanks', (req, res) => {
    res.sendFile(__dirname + '/front/thanks.html');
});

app.get('/ipmanager', (req, res) => {
    res.sendFile(__dirname + '/front/ipmanager.html');
})

app.get('/col/:id', (req, res) => {
    res.sendFile(__dirname + "/front/col.html");
})

app.get('/vote/:id', (req, res) => {
    res.sendFile(__dirname + '/front/vote.html');
});

app.get('/contribute/:id', (req, res) => {
    res.sendFile(__dirname + '/front/contribute.html');
});

app.get('/rapport/:id', (req, res) => {
    res.sendFile(__dirname + '/front/rapport.html');
})

if (config.environment == "dev"){
    app.get('/errors/:id',(req,res) => {
        const id = req.params.id;
        res.sendFile(__dirname+`/front/errors/${id}.html`)
    })
}

app.get('/:id', (req, res) => {
    const id = req.params.id;
    const col_mode = Boolean(req.query.col);
    if (config.secured_mode && !config.security.authorized_ips.includes(req.ip) && !config.security.temporary_authorized_ip.some((ip) => { ip.ip == req.ip })) {
        return res.status(403).sendFile(__dirname + "/front/errors/403.html");
    }

    if (config.security.demo_mode && id == "demo"){
        return res.sendFile(__dirname + '/front/index_demo.html');
    }

    const campaigns = fs.readdirSync(__dirname + '/data/')
    if (!(id != "" && campaigns.includes(`campaign_${id}.json`))) {
        return res.status(404).sendFile(__dirname + "/front/errors/404.html");
    }

    if(col_mode){
        return res.sendFile(__dirname + '/front/col.html')
    } else {
        return res.sendFile(__dirname + '/front/index.html');
    }
});

// Envoi des erreurs 404

app.use((req, res, next) => {
    res.status(404).sendFile(__dirname + "/front/errors/404.html")
})

const server =app.listen(config.port, config.host, () => {
    console.log(`PlockIt app listening on ${config.host}:${config.port}`)
    console.log(`Environnement de l'application: ${config.environment} en mode ${config.security.secured_mode? "sécurisé" : "non sécurisé"}`)
    console.log(`Demo mode: ${config.security.demo_mode? "enabled" : "disabled"}`);
})

process.on('SIGTERM', ()=>{
    // Fermeture de l'application par le système
    console.log(chalk.green(`[${new Date().toISOString()}] SIGTERM received. Shutting down server...`));

    if (config.security.demo_mode){
        demoMode.deleteDemoFiles();
        console.log(chalk.green(`[${new Date().toISOString()}] Demo files deleted.`));
    }

    server.close();
    console.log(chalk.green(`[${new Date().toISOString()}] Server shotdowned.`));
})

process.on('SIGINT',()=>{
    // Fermeture de l'application avec Ctrl+C
    
    console.log(chalk.green(`[${new Date().toISOString()}] SIGTERM received. Shutting down server...`));

    if (config.security.demo_mode){
        demoMode.deleteDemoFiles();
        console.log(chalk.green(`[${new Date().toISOString()}] Demo files deleted.`));
    }
    
    server.close();
    console.log(chalk.green(`[${new Date().toISOString()}] Server shotdowned.`));
})