// do I need this?
module.exports = {
  name: 'interactionCreate',
  execute(interaction) {
    console.log(`${interaction.user.tag} in #${interaction.channel} triggered an interaction.`);
  },
};