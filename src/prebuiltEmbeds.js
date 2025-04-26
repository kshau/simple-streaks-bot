import { EmbedBuilder } from 'discord.js';

const { BOT_EMBED_COLOR } = process.env;

export const negativeStreakErrorEmbed = new EmbedBuilder()
    .setTitle("Error :x:")
    .setDescription(`Your streak can't be less than \`0\` days!`)
    .setTimestamp()
    .setColor(BOT_EMBED_COLOR)