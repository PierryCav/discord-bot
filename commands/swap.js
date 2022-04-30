const {GuildMember} = require('discord.js');

module.exports = {
  name: 'swap',
  description: 'trocar posições de música na fila!',
  options: [
    {
      name: 'track1',
      type: 4, // 'INTEGER' Type
      description: 'O número da faixa que você deseja trocar',
      required: true,
    },
    {
      name: 'track2',
      type: 4, // 'INTEGER' Type
      description: 'O número da faixa que você deseja trocar',
      required: true,
    },
  ],
  async execute(interaction, player) {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      return void interaction.reply({
        content: '**( ❌ ) - Você não está em um canal de voz!**',
        ephemeral: true,
      });
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
    ) {
      return void interaction.reply({
        content: '**( ❌ ) - Você não está no meu canal de voz**!',
        ephemeral: true,
      });
    }

    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) return void interaction.followUp({content: '**( ❌ ) - Nenhuma música está sendo tocada**!'});
    const queueNumbers = [interaction.options.get('track1').value - 1, interaction.options.get('track2').value - 1];
    // Sort so the lowest number is first for swap logic to work
    queueNumbers.sort(function (a, b) {
      return a - b;
    });
    if (queueNumbers[1] > queue.tracks.length)
      return void interaction.followUp({content: '**( ❌ ) - Número de faixa maior que a profundidade da fila!'});

    try {
      const track2 = queue.remove(queueNumbers[1]); // Remove higher track first to avoid list order issues
      const track1 = queue.remove(queueNumbers[0]);
      queue.insert(track2, queueNumbers[0]); // Add track in lowest position first to avoid list order issues
      queue.insert(track1, queueNumbers[1]);
      return void interaction.followUp({
        content: `**( ✅ ) -** Trocado **${track1}** & **${track2}**!`,
      });
    } catch (error) {
      console.log(error);
      return void interaction.followUp({
        content: '**( ❌ ) - Algo deu errado!**',
      });
    }
  },
};
