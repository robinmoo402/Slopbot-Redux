const { SlashCommandBuilder } = require('discord.js');

let num = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('add [x] to the counter')
        .addNumberOption(option => option.setName('x')
            .setDescription('The number to be added to the counter')),
    async execute(interaction) {
        const x = interaction.options.getNumber('x');
        num = num + x;
        await interaction.reply(`Counter: ${num}`);
    },
};
