import { configDotenv } from 'dotenv';
configDotenv();

import database from "../database.js";

import { EmbedBuilder } from 'discord.js';

import { negativeStreakErrorEmbed } from '../prebuiltEmbeds.js';

const { BOT_EMBED_COLOR } = process.env;

export async function SetStreakCommand(client, interaction) {
    
    const name = interaction.options.get("name").value;
    const newDays = interaction.options.get("new-days").value;

    const streakDocWithSameName = await database.collection("streaks").findOne({ name });

    if (!streakDocWithSameName) {

        const embed = new EmbedBuilder()
            .setTitle("Error :x:")
            .setDescription(`You don't have a streak named \`${name}\`! Use \`/create\` to create one.`)
            .setTimestamp()
            .setColor(BOT_EMBED_COLOR)
    
        await interaction.reply({"embeds": [embed], "ephemeral": true});
        return;

    }

    if (newDays < 0) {
        await interaction.reply({"embeds": [negativeStreakErrorEmbed], "ephemeral": true});
        return;
    }

    await database.collection("streaks").findOneAndUpdate({
        name, 
        userId: interaction.user.id
    }, { $set: { startTimestamp: Date.now() - newDays * 24 * 60 * 60 * 1000 } })

    const embed = new EmbedBuilder()
        .setTitle("Streak Updated :pencil:")
        .setDescription(`Streak \`${name}\` for ${interaction.user} has been set to \`${newDays}\` days.`)
        .setTimestamp()
        .setColor(BOT_EMBED_COLOR)

    
    await interaction.reply({"embeds": [embed]});

}