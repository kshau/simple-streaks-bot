import { configDotenv } from 'dotenv';
configDotenv();

import database from "../database.js";

import { EmbedBuilder } from 'discord.js';

import { errorTitle, qtyTooLowErrorEmbed } from '../prebuiltEmbeds.js';

const { BOT_EMBED_COLOR } = process.env;

export async function SetStreakCommand(client, interaction) {
    
    const name = interaction.options.get("name").value.toLowerCase().trim();
    const newStreak = interaction.options.get("new-streak").value;

    const existingStreakDoc = await database.collection("streaks").findOne({ name, userId: interaction.user.id });

    if (!existingStreakDoc) {

        const embed = new EmbedBuilder()
            .setTitle(errorTitle)
            .setDescription(`You don't have a streak named \`${name}\`! Use \`/create\` to create one.`)
            .setTimestamp()
            .setColor(BOT_EMBED_COLOR)
    
        await interaction.reply({"embeds": [embed], "ephemeral": true});
        return;

    }

    if (newStreak < 0) {
        await interaction.reply({"embeds": [qtyTooLowErrorEmbed], "ephemeral": true});
        return;
    }

    await database.collection("streaks").findOneAndUpdate({
        name, 
        userId: interaction.user.id
    }, { $set: { startTimestamp: Date.now() - newStreak * 24 * 60 * 60 * 1000 } })

    const embed = new EmbedBuilder()
        .setTitle("Streak Updated :pencil:")
        .setDescription(`Streak \`${name}\` for ${interaction.user} has been set to \`${newStreak}\` days.`)
        .setTimestamp()
        .setColor(BOT_EMBED_COLOR)

    
    await interaction.reply({"embeds": [embed]});

}
