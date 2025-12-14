import config from '../../config.js';
import cron from 'node-cron';
import chalk from "chalk";
import fs from "fs"

function initCronJobs() {
    cron.schedule("0 8 * * 4", () => {
        console.log("Running weekly cleanup of temporary authorized IPs");
        console.log(config)
        const tempIpBefore = config.security.temporary_authorized_ip.length;
        const now = new Date();
        config.security.temporary_authorized_ip = config.security.temporary_authorized_ip.filter((ip) => {
            ip.expires_at <= now;
        });
        const tempIpAfter = config.security.temporary_authorized_ip.length;
        console.log(`${tempIpBefore - tempIpAfter} ips effacés`)
    });

    if (config.security.demo_mode) {
        const demoCampaignFile = `./src/data/campaign_demo.json`;
        cron.schedule("*/10 * * * *", () => {
            console.log(chalk.yellow(`[${new Date().toISOString()}] Demo mode active - Cleaning Demo Campaign Board`));

            // Nettoyage de la campagne de demo
            if (fs.existsSync(demoCampaignFile)) {
                const content = fs.readFileSync(demoCampaignFile);
                const demoCampaign = JSON.parse(content);
                demoCampaign.items = [];
                demoCampaign.votants = [];
                fs.writeFileSync(demoCampaignFile, JSON.stringify(demoCampaign));
                console.log(chalk.yellow(`[${new Date().toISOString()}] Demo board cleaned`));
            }
        });

        cron.schedule("*/30 * * * *", () => {
            console.log(chalk.yellow(`[${new Date().toISOString()}] Demo mode active - Deleting public campaigns`));

            // Nettoyage de la campagne de demo
            
            fs.readdirSync(`./src/data/`).forEach(file => {
                if (file != demoCampaignFile) {
                    fs.rmSync(`./src/data/${file}`);
                }
            });
            console.log(chalk.yellow(`[${new Date().toISOString()}] Public campaigns deleted`));
        });
    }

}

export default {
    initCronJobs
}