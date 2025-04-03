const { REST, Routes } = require('discord.js');
const commands = require('./commands');

async function registerCommands(client, token) {
  const rest = new REST({ version: '10' }).setToken(token);
  const guilds = client.guilds.cache.map(g => g.id);

  for (const guildId of guilds) {
    try {
      console.log(`📌 ${guildId}에 커맨드 등록 중...`);
      await rest.put(Routes.applicationGuildCommands(client.user.id, guildId), {
        body: commands,
      });
    } catch (err) {
      console.error(`❌ ${guildId} 커맨드 등록 실패:`, err);
    }
  }

  console.log('✅ 모든 서버에 커맨드 등록 완료!');
}

module.exports = registerCommands;
