import { configDotenv } from 'dotenv';
configDotenv();

import database from "../database.js";

import { EmbedBuilder } from 'discord.js';
import { streakDoesntExistErrorEmbed } from '../prebuiltEmbeds.js';

const { BOT_EMBED_COLOR } = process.env;

export async function SetGoalCommand(client, interaction) {
    
    const streakName = interaction.options.get("streak-name").value.toLowerCase().trim();
    const newGoal = interaction.options.get("new-goal").value;

    const existingStreakDoc = await database.collection("streaks").findOne({ name: streakName, userId: interaction.user.id });

    if (!existingStreakDoc) {
        await interaction.reply({"embeds": [streakDoesntExistErrorEmbed(streakName)], "ephemeral": true});
        return;
    }

    if (newGoal < 1) {
        
        await database.collection("streaks").findOneAndUpdate({
            name: streakName, 
            userId: interaction.user.id
        }, { $set: { goal: 0 } })

        const embed = new EmbedBuilder()
            .setTitle("Goal Deleted :wastebasket:")
            .setDescription(`Goal for streak \`${streakName}\` for ${interaction.user} has been deleted!`)
            .setTimestamp()
            .setColor(BOT_EMBED_COLOR)
    
        await interaction.reply({"embeds": [embed]});

        return;
    }

    await database.collection("streaks").findOneAndUpdate({
        name: streakName, 
        userId: interaction.user.id
    }, { $set: { goal: newGoal } })

    const embed = new EmbedBuilder()
        .setTitle("Goal Updated :pencil:")
        .setDescription(`Goal for streak \`${streakName}\` for ${interaction.user} has been set to \`${newGoal}\` days!`)
        .setTimestamp()
        .setColor(BOT_EMBED_COLOR)
    
    await interaction.reply({"embeds": [embed]});

}
