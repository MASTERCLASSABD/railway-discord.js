require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
} = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = "1111864772158296074";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.once("clientReady", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    const commands = [
      new SlashCommandBuilder()
        .setName("join")
        .setDescription("Fait rejoindre le bot à ton salon vocal"),
    ].map((command) => command.toJSON());

    const rest = new REST({ version: "10" }).setToken(TOKEN);

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log("Commande /join enregistrée.");
  } catch (error) {
    console.error("Erreur enregistrement commande :", error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "join") {
    const channel = interaction.member?.voice?.channel;

    if (!channel) {
      return interaction.reply({
        content: "Tu dois être dans un salon vocal.",
        ephemeral: true,
      });
    }

    try {
      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: true,
        selfMute: false,
      });

      await interaction.reply({
        content: `Je rejoins **${channel.name}**.`,
        ephemeral: true,
      });

      console.log(`Bot a rejoint ${channel.name}`);
    } catch (error) {
      console.error("Erreur join voc :", error);

      await interaction.reply({
        content: "Impossible de rejoindre la voc.",
        ephemeral: true,
      });
    }
  }
});

client.login(TOKEN);
