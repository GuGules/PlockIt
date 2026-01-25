import fs from 'fs'
import path from 'path';

export function getLatestCampaignFile() {
  const files = fs.readdirSync("./src/data/");

  const campaignFiles = files
    .map(file => {
      const match = file.match(/^campaign_(\d+)\.json$/);
      if (!match) return null;

      return {
        file,
        timestamp: Number(match[1])
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.timestamp - a.timestamp);

  return campaignFiles.length > 0
    ? campaignFiles[0].timestamp
    : null;
}

export default {
    getLatestCampaignFile
}