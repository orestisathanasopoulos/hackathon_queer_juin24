import {
  Client,
  GatewayIntentBits,
  Events,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import { config } from "dotenv";
config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildWebhooks,
  ],
});

client.once(Events.ClientReady, () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  const authorisedBots = ["Candidat.e.s Bot"];
  if (!authorisedBots.includes(message.author.username)) return;

  const userToInvite = ".__ori__";

  const acceptButton = new ButtonBuilder()
    .setCustomId("accept")
    .setLabel("Accept")
    .setStyle(ButtonStyle.Success);

  const refuseButton = new ButtonBuilder()
    .setCustomId("refuse")
    .setLabel("Refuse")
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder().addComponents(acceptButton, refuseButton);

  await message.reply({
    content: `Do you accept or refuse this message?`,
    components: [row],
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "accept") {
    await interaction.reply(`Invitation envoyée à ${userToInvite}`);
  } else if (interaction.customId === "refuse") {
    await interaction.reply("You refused the message.");
  }
});

client.login(process.env.BOT_TOKEN);
