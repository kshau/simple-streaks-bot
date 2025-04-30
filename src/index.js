import { configDotenv } from 'dotenv';
configDotenv();

import { Client, GatewayIntentBits, Events, ActivityType } from 'discord.js';

import { registerCommands } from './registerCommands.js';
import database from "./database.js";

import { CreateStreakCommand } from './commands/CreateStreakCommand.js';
import { ViewStreaksCommand } from './commands/ViewStreaksCommand.js';
import { SetStreakCommand } from './commands/SetStreakCommand.js';
import { DeleteStreakCommand } from './commands/DeleteStreakCommand.js';
import { SetGoalCommand } from './commands/SetGoalCommand.js';

const {BOT_TOKEN} = process.env;

const client = new Client({intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMessagePolls
]});

const commands = [
    {
        "name": "create", 
        "description": "Creates a streak.", 
        "options": [
            {
                "name": "name", 
                "description": "Name of streak.", 
                "type": 3,
                "required": true
            }, 
            {
                "name": "starting-streak", 
                "description": "Number of days you already have on streak.", 
                "type": 4,
                "required": false
            }
        ],
        "command": CreateStreakCommand
    }, 
    {
        "name": "streaks", 
        "description": "Displays all of your streaks.", 
        "options": [
            {
                "name": "user", 
                "description": "Which user's streaks?", 
                "type": 6,
                "required": false
            }, 
        ],
        "command": ViewStreaksCommand
    }, 
    {
        "name": "set", 
        "description": "Sets a streak to a new value.", 
        "options": [
            {
                "name": "name", 
                "description": "Name of streak.", 
                "type": 3,
                "required": true
            }, 
            {
                "name": "new-streak", 
                "description": "New number of days you want to set this streak to.", 
                "type": 4,
                "required": true
            }
        ],
        "command": SetStreakCommand
    }, 
    {
        "name": "delete", 
        "description": "Deletes a streak.", 
        "options": [
            {
                "name": "name", 
                "description": "Name of streak.", 
                "type": 3,
                "required": true
            }, 
        ],
        "command": DeleteStreakCommand
    },
    {
        "name": "setgoal", 
        "description": "Sets a streak goal.", 
        "options": [
            {
                "name": "streak-name", 
                "description": "Name of streak.", 
                "type": 3,
                "required": true
            }, 
            {
                "name": "new-goal", 
                "description": "Number of days you want the goal to be.", 
                "type": 4,
                "required": true
            }, 
        ],
        "command": SetGoalCommand
    },
];

registerCommands(commands);

client.on("ready", () => {

    client.user.setPresence({
        activities: [{
            type: ActivityType.Custom, 
            name: "Lock in."
        }]
    })

    console.log(`Logged in as ${client.user.tag}!`);

});

client.on("interactionCreate", async interaction => {

    try {
        if (!interaction.isChatInputCommand()) return;

        for (var c of commands) {
            const {name, command} = c;
            if (name == interaction.commandName) {
                await command(client, interaction);
                break;
            }
        }
    }

    catch (err) {
        console.error(`Error: ${err.message} [${interaction.commandName}]`);
    }

});

client.on(Events.ShardError, error => {
	console.error('A websocket connection encountered an error:', error);
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.login(BOT_TOKEN);