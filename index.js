const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
var fs = require("fs");
const discord = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const { type } = require("os");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const client = new Client({
  intents: Object.values(discord.IntentsBitField.Flags),
});

client.once("ready", () => {
  console.log(`${client.user.tag} is ready!`);
});

client.on("ready", async () => {
  const chat = [
    {
      name: "gpt",
      description: "I'm Chatbot",
      options: [
        {
          type: 3,
          name: "質問",
          description: "質問を入力してください",
          required: true,
        },
      ],
    },
  ];

  await client.application.commands.set(chat);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = interaction.commandName;

  if (command === "gpt") {
    const question = interaction.options.getString("質問");
    console.log(question);

    await interaction.deferReply();

    (async () => {
      try {
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: `${question}` }],
        });
        const answer = completion.data.choices[0].text;
        await interaction.editReply(
          `${question}\n>>${completion.data.choices[0].message.content.trim()}\r\n`
        );
      } catch (error) {
        console.error(error);
        await interaction.editReply(`エラーが発生しました: ${error.message}`);
      }
    })();
  }
});

client.login(process.env.BOT_TOKEN);
