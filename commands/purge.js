module.exports = {
  name: 'purge',
  description: 'Apague as últimas mensagens em todos os chats.',
  options: [
    {
      name: 'num',
      type: 4, //'INTEGER' Type
      description: 'O número de mensagens que você deseja excluir. (máximo 100)',
      required: true,
    },
  ],
  async execute(interaction) {
    const deleteCount = interaction.options.get('num').value;

    if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
      return void interaction.reply({
        content: `**( ❌ ) - Forneça um número entre 2 e 100 para o número de mensagens a serem excluídas**`,
        ephemeral: true,
      });
    }

    const fetched = await interaction.channel.messages.fetch({
      limit: deleteCount,
    });

    interaction.channel
      .bulkDelete(fetched)
      .then(() => {
        interaction.reply({
          content: `Mensagens excluídas com sucesso`,
          ephemeral: true,
        });
      })
      .catch(error => {
        interaction.reply({
          content: `**( ❌ ) - Não foi possível excluir mensagens devido a: ${error}`,
          ephemeral: true,
        });
      });
  },
};
