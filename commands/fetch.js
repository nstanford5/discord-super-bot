const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fetch')
    .setDescription('Launch fetch-nft'),
    async execute(interaction){
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('fetch-eth-nfts')
            .setLabel('Get ETH NFTs')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false),
          new ButtonBuilder()
            .setCustomId('fetch-sol-nfts')
            .setLabel('Get SOL NFTs')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false),
          new ButtonBuilder()
            .setCustomId('test-ada-stuff')
            .setLabel('blah, blah Cardano')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
        )
        await interaction.reply({
          content: 'Launch the Fetch-NFT',
          components: [row],
        })
    }
}