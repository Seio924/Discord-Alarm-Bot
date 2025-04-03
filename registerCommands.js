const { REST, Routes } = require('discord.js');
const commands = require('./commands');

async function registerCommandsToGuild(clientId, guildId, token) {
  const rest = new REST({ version: '10' }).setToken(token);

  try {
    const result = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });
    console.log(`✅ ${guildId} 서버에 등록된 커맨드:`, result.map(c => c.name).join(', '));
  } catch (err) {
    console.error(`❌ ${guildId} 커맨드 등록 실패:`, err);
  }
}

module.exports = registerCommandsToGuild;
