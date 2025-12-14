import fs from 'fs';

export function deleteDemoFiles(){
    fs.rmSync('./src/data/campaign_demo.json', { force: true });
}

export default {
    deleteDemoFiles
}