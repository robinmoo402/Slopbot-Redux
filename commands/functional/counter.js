const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

let nums = JSON.parse(fs.readFileSync('./counters.json'),(key, value) =>
    key === "" ? new Map(value) : value,);

let goals = JSON.parse(fs.readFileSync('./goals.json'),(key, value) =>
    key === "" ? new Map(value) : value,);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('counter')
        .setDescription('Modify the server\'s counter')
        .addSubcommand(subcommand => subcommand
            .setName('add')
            .setDescription('add to the counter')
            .addNumberOption(option => option.setName('x')
                .setDescription('The number to be added to the counter')
                .setRequired(true))
            )
        .addSubcommand(subcommand => subcommand
            .setName('reset')
            .setDescription('reset the counter')
            )
        .addSubcommand(subcommand => subcommand
            .setName('goal')
            .setDescription('set the counter goal')
            .addNumberOption(option => option.setName('goal')
                .setDescription('The number to be set as the goal')
                .setRequired(true))
            ),
    async execute(interaction) {
        if(interaction.options.getSubcommand()==='add'){
            let num;

            if (nums.has(interaction.guildId)) {
                num = nums.get(interaction.guildId);
            } else {
                num = 0
            }

            const x = interaction.options.getNumber('x');
            num = num + x;
            nums.set(interaction.guildId, num);
            await interaction.reply(`Counter + ${x} = ${num}`);
            if(goals.has(interaction.guildId)){
                if (num>=goals.get(interaction.guildId)){
                    interaction.channel.send(`# The goal of ${goals.get(interaction.guildId)} has been reached!`)
                }
            }
            
            fs.writeFileSync('./counters.json',JSON.stringify(nums, (key,value) => 
            value instanceof Map ? Array.from(value.entries()) : value,))
        } else if (interaction.options.getSubcommand()==='reset'){
            nums.set(interaction.guildId, 0);
            await interaction.reply('The counter has been reset.');

            fs.writeFileSync('./counters.json',JSON.stringify(nums, (key,value) => 
            value instanceof Map ? Array.from(value.entries()) : value,))
        } else if (interaction.options.getSubcommand()==='goal'){
            goals.set(interaction.guildId, interaction.options.getNumber('goal'));
            await interaction.reply(`The counter\'s goal has been set to ${goals.get(interaction.guildId)}`);
            
            fs.writeFileSync('./goals.json',JSON.stringify(goals, (key,value) => 
            value instanceof Map ? Array.from(value.entries()) : value,))
        }
    },
};
