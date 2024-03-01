
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
var cron = require('node-cron');
const ArrayList = require("arraylist")
var list = new ArrayList;
const config = require('./config.json');

const Enabledrow = new ButtonBuilder()
  .setCustomId('primary')
  .setLabel('참여하기')
  .setStyle(ButtonStyle.Success)

const Disabledrow = new ButtonBuilder()
  .setCustomId('primary')
  .setLabel('종료된 이벤트입니다.')
  .setStyle(ButtonStyle.Danger)
  .setDisabled(true)

const Embed = new EmbedBuilder()
	.setColor(Colors.Blurple)
  .setImage("https://cdn.discordapp.com/attachments/1109131749100896266/1173238402917875784/hot-time_image.png")

const row = new ActionRowBuilder()
.addComponents(Enabledrow);

const row2 = new ActionRowBuilder()
.addComponents(Disabledrow);

cron.schedule('0 0 0 * * *', async () => {
  list.clear();
  try {
    let channel = client.channels.cache.get(config.channelID);
    if (channel) {
      let sentMessage = await channel.send({ content: "핫타임이 시작되었습니다.", embeds: [Embed], components: [row] })
      setTimeout(() => {
        sentMessage.edit({ embeds: [Embed], components: [row2] });
      }, 60000 * 5);
    } else {
      console.error("텍스트 채널을 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error("에러 발생:", error);
  }
}, {
  timezone: "Asia/Seoul"
})  

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;
  if (interaction.customId === 'primary') {
    const random = Math.random()
    if (list.contains(interaction.user.id)) {
      try {
        await interaction.reply({content: "이미 참여했습니다. 다음 핫타임을 기다려주세요!", ephemeral: true});
      } catch (error) {
        console.error("에러 발생:", error);
      }
    } else if (random < 0.002) {
      try {
        const WinEmbed = new EmbedBuilder()
          .setColor('0xffc0cb')
          .setTitle(`??${interaction.user.tag}님이 극악의 확률을 뚫고 당첨되었습니다!`)
        await interaction.channel.send({ content: "<@1065303265350262866>", embeds: [WinEmbed]})
        list.add(interaction.user.id);
      } catch (error) {
        console.error("에러 발생:", error);
      }
    } else {
      try {
        await interaction.reply({content: "아쉽게도 확률을 뚫지 못했습니다.", ephemeral: true})
      } catch (error) {
        console.error("에러 발생:", error);
      }
      list.add(interaction.user.id);
    }
  }
})

const date = new Date();
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!\n${date.toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
  })}`);
});

client.login(config.token);
