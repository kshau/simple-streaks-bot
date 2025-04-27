import { EmbedBuilder } from 'discord.js';

const { BOT_EMBED_COLOR } = process.env;

export const errorTitle = "Error :x:";

export const qtyTooLowErrorEmbed = (qtyName, maxQty) => new EmbedBuilder()
    .setTitle(errorTitle)
    .setDescription(`Your ${qtyName} can't be less than \`${maxQty}\` days!`)
    .setTimestamp()
    .setColor(BOT_EMBED_COLOR)

export const streakDoesntExistErrorEmbed = (streakName) => new EmbedBuilder()
    .setTitle(errorTitle)
    .setDescription(`You don't have a streak named \`${streakName}\`! Use \`/create\` to create one.`)
    .setTimestamp()
    .setColor(BOT_EMBED_COLOR)