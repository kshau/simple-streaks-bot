import { configDotenv } from 'dotenv';
configDotenv();

import database from "../database.js";

import { EmbedBuilder } from 'discord.js';

export async function DeleteStreakCommand(client, interaction) {
    
    const name = interaction.options.get("name").value;

    const streakDocWithSameName = await database.collection("streaks").findOne({ name });

    if (!streakDocWithSameName) {

        const embed = new EmbedBuilder()
            .setTitle("Error :x:")
            .setDescription(`You don't have a streak named \`${name}\`!`)
            .setTimestamp()
    
        await interaction.reply({"embeds": [embed], "ephemeral": true});
        return;

    }

    await database.collection("streaks").findOneAndDelete({
        userId: interaction.user.id, 
        name
    })

    const embed = new EmbedBuilder()
        .setTitle("Streak Deleted :wastebasket:")
        .setDescription(`Streak \`${name}\` for ${interaction.user} has been deleted!`)
        .setTimestamp()

    
    await interaction.reply({"embeds": [embed]});

}