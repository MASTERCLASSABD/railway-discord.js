require("dotenv").config();

const { Client, GatewayIntentBits, ChannelType } = require("discord.js");
const {
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState,
} = require("@discordjs/voice");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const GUILD_ID = "1111864772158296074";
const VOICE_CHANNEL_ID = "1254186619934740512";

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const channel = await guild.channels.fetch(VOICE_CHANNEL_ID);

    console.log(`Serveur ciblé: ${guild.name}`);
    console.log(`Salon ciblé: ${channel?.name}`);
    console.log(`Type du salon: ${channel?.type}`);

    if (!channel) {
      throw new Error("Salon introuvable.");
    }

    if (
      channel.type !== ChannelType.GuildVoice &&
      channel.type !== ChannelType.GuildStageVoice
    ) {
      throw new Error("L'ID ne correspond pas à un salon vocal.");
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: true,
      selfMute: false,
    });

    connection.on("stateChange", (oldState, newState) => {
      console.log(`Voice state: ${oldState.status} -> ${newState.status}`);
    });

    await entersState(connection, VoiceConnectionStatus.Ready, 15_000);
    console.log("Connexion voc READY");
  } catch (error) {
    console.error("Erreur connexion voc :", error);
  }
});

client.login(process.env.TOKEN);
