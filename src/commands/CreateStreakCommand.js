import { configDotenv } from 'dotenv';
configDotenv();

import database from "../database.js";

import { EmbedBuilder } from 'discord.js';
import { negativeStreakErrorEmbed } from '../prebuiltEmbeds.js';

const { BOT_EMBED_COLOR } = process.env;

export async function CreateStreakCommand(client, interaction) {
    
    const name = interaction.options.get("name").value;
    const startingDays = interaction.options.get("starting-days")?.value || 0;

    const streakDocWithSameName = await database.collection("streaks").findOne({ name });

    if (streakDocWithSameName) {
        const embed = new EmbedBuilder()
            .setTitle("Error :x:")
            .setDescription(`You already have a streak named \`${name}\`!`)
            .setTimestamp()
            .setColor(BOT_EMBED_COLOR)
    
        await interaction.reply({"embeds": [embed], "ephemeral": true});
        return;
    }

    if (startingDays < 0) {
        await interaction.reply({"embeds": [negativeStreakErrorEmbed], "ephemeral": true});
        return;
    }

    await database.collection("streaks").insertOne({
        id: interaction.id,
        name,
        userId: interaction.user.id,
        startTimestamp: Date.now() - startingDays * 24 * 60 * 60 * 1000
    })

    const embed = new EmbedBuilder()
        .setTitle("Streak Created :flex:")
        .setDescription(`Streak \`${name}\` created for ${interaction.user} and is currently set to \`${startingDays}\` days.`)
        .setTimestamp()
        .setColor(BOT_EMBED_COLOR)

    await interaction.reply({"embeds": [embed]});

}