import { configDotenv } from 'dotenv';
configDotenv();

import database from "../database.js";

import { EmbedBuilder } from 'discord.js';
import { errorTitle, qtyTooLowErrorEmbed } from '../prebuiltEmbeds.js';
import { caseInsensitiveQueryValue } from '../utils.js';

const { BOT_EMBED_COLOR } = process.env;

export async function CreateStreakCommand(client, interaction) {
    
    const name = interaction.options.get("name").value;
    const startingStreak = interaction.options.get("starting-streak")?.value || 0;

    const existingStreakDoc = await database.collection("streaks").findOne({ name: caseInsensitiveQueryValue(name) });

    if (existingStreakDoc) {

        const embed = new EmbedBuilder()
            .setTitle(errorTitle)
            .setDescription(`You already have a streak named \`${existingStreakDoc.name}\`!`)
            .setTimestamp()
            .setColor(BOT_EMBED_COLOR)
    
        await interaction.reply({"embeds": [embed], "ephemeral": true});
        return;
    }

    if (startingStreak < 0) {
        await interaction.reply({"embeds": [qtyTooLowErrorEmbed("streak", 0)], "ephemeral": true});
        return;
    }

    await database.collection("streaks").insertOne({
        id: interaction.id,
        name: caseInsensitiveQueryValue(name),
        userId: interaction.user.id,
        startTimestamp: Date.now() - startingStreak * 24 * 60 * 60 * 1000,
        goal: 0
    })

    const embed = new EmbedBuilder()
        .setTitle("Streak Created :muscle:")
        .setDescription(`Streak \`${name}\` created for ${interaction.user} and is currently set to \`${startingStreak}\` days.`)
        .setTimestamp()
        .setColor(BOT_EMBED_COLOR)

    await interaction.reply({"embeds": [embed]});

}
