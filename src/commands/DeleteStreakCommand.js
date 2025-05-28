import { configDotenv } from 'dotenv';
configDotenv();

import database from "../database.js";

import { EmbedBuilder } from 'discord.js';
import { caseInsensitiveQueryValue } from '../utils.js';

const { BOT_EMBED_COLOR } = process.env;

export async function DeleteStreakCommand(client, interaction) {
    
    const name = interaction.options.get("name").value;

    const existingStreakDoc = await database.collection("streaks").findOne({ name: caseInsensitiveQueryValue(name) });

    if (!existingStreakDoc) {

        const embed = new EmbedBuilder()
            .setTitle("Error :x:")
            .setDescription(`You don't have a streak named \`${name}\`!`)
            .setTimestamp()
            .setColor(BOT_EMBED_COLOR)
    
        await interaction.reply({"embeds": [embed], "ephemeral": true});
        return;

    }

    await database.collection("streaks").findOneAndDelete({
        userId: interaction.user.id, 
        name: caseInsensitiveQueryValue(name)
    })

    const embed = new EmbedBuilder()
        .setTitle("Streak Deleted :wastebasket:")
        .setDescription(`Streak \`${existingStreakDoc.name}\` for ${interaction.user} has been deleted!`)
        .setTimestamp()
        .setColor(BOT_EMBED_COLOR)

    
    await interaction.reply({"embeds": [embed]});

}