const config = require('../../config');
const cron = require('node-cron');

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
        console.log(`${tempIpBefore-tempIpAfter} ips effacés`)
    });
}

module.exports = {
    initCronJobs
}