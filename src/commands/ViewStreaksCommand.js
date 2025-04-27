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

            let fieldValue;

            const streakDays = Math.floor((Date.now() - doc.startTimestamp) / (24 * 60 * 60 * 1000));
            fieldValue = `\`${streakDays}\` days`;

            if (doc.goal) {
                const goalCompletionPercentage = Math.floor((streakDays / doc.goal) * 100);
                fieldValue = `${goalCompletionPercentage >= 100 ? ":white_check_mark:" : ""} \`${streakDays}\` / ${doc.goal} days (\`${goalCompletionPercentage}%\`)`;
            }

            return { name: doc.name, value: fieldValue, inline: true }
        }))

        .setTimestamp()
        .setColor(BOT_EMBED_COLOR)

    
    await interaction.reply({"embeds": [embed]});

}