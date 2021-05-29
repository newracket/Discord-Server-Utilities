const { CustomCommand } = require("../../modules/utils");
const axios = require("axios");

class DefinitionCommand extends CustomCommand {
  constructor() {
    super('define', {
      aliases: ['define'],
      description: "Defines a word",
      usage: "define <word>",
      category: "Misc",
      slashCommand: true,
      args: [{
        id: "word",
        match: "content",
        type: "string",
        description: "Word to define",
        required: true
      }]
    });
  }

  async exec(message, args) {
    if (!args.word) return message.reply("Word not specified");

    const definitionData = (await axios.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${args.word}?key=10c40550-08a5-4409-a3b1-15af69ba52ba`)).data;

    if (typeof definitionData[0] == "string") return message.reply(`Definition not found. Some possible words are: \n\n${definitionData.join(", ")}`);
    message.reply(`__**Definitions of ${args.word}:**__\n\n${definitionData.map((definition, i) => `${i + 1}. ${definition.shortdef}`).join("\n")}`);
  }
}

module.exports = DefinitionCommand;