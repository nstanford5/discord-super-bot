const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sms')
        .setDescription('Send SMS text message'),
        async execute(interaction){
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('send-sms')
                        .setLabel('Use API to send SMS')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(false),
                )
                await interaction.reply({
                    content: 'Launch the SMS messager',
                    components: [row],
                })
        }
}