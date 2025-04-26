import { configDotenv } from 'dotenv';
configDotenv();

import { REST, Routes } from 'discord.js';

const {BOT_TOKEN, BOT_ID} = process.env;

const rest = new REST({version: "10"}).setToken(BOT_TOKEN);

export async function registerCommands(commands) {
    
    try {

        const formattedCommands = commands.map(c => {
            const { name, description, options } = c;
            return {
                name,
                description,
                options: options || []
            };
        });

        await rest.put(Routes.applicationCommands(BOT_ID), {body: formattedCommands});
        console.log('Successfully reloaded application (/) commands.');
    } catch (err) {
        console.error(err);
    }
}