const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('basic test command'),
    async execute(interaction) {
        await interaction.reply('yuri has conquered the earth');
    },
};
