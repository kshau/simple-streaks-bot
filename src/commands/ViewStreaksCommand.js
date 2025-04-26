import { configDotenv } from 'dotenv';
configDotenv();

import database from "../database.js";

import { EmbedBuilder } from 'discord.js';

const { BOT_EMBED_COLOR } = process.env;

export async function ViewStreaksCommand(client, interaction) {

    const user = interaction.options.getUser("user") || interaction.user;

    const streakDocs = await database.collection("streaks").find({
        userId: user.id
    }).toArray()

    const embed = new EmbedBuilder()
        .setTitle(`Streaks :scroll:`)
        .setDescription(`**User:** ${user}\n\n` + (streakDocs.length > 0 ? " " : `*No streaks for this user!*`))
        .addFields(...streakDocs.map(doc => {
            const streakDays = Math.floor((Date.now() - doc.startTimestamp) / (24 * 60 * 60 * 1000));
            return { name: doc.name, value: `\`${streakDays}\` days`, inline: true }
        }))
        .setTimestamp()
        .setColor(BOT_EMBED_COLOR)

    
    await interaction.reply({"embeds": [embed]});

}