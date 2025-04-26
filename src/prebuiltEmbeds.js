import { EmbedBuilder } from 'discord.js';

export const negativeStreakErrorEmbed = new EmbedBuilder()
    .setTitle("Error :x:")
    .setDescription(`Your streak can't be less than \`0\` days!`)
    .setTimestamp()