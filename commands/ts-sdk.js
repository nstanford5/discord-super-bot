const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ts-sdk')
    .setDescription('Launch ts-sdk demo'),
    async execute(interaction){
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('show-ada-amount')
            .setLabel('Get preprod ADA amount')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false),
        )
        await interaction.reply({
          content: 'Get ADA',
          components: [row],
        })
    }
}