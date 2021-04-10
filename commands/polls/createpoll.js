const { CustomCommand } = require("../../modules/custommodules");
const JSONFileManager = require("../../modules/jsonfilemanager");
const chrono = require("chrono-node");

const storedpollsJSON = new JSONFileManager("storedpolls");

class CreatePollCommand extends CustomCommand {
  constructor() {
    super('createpoll', {
      aliases: ['createpoll'],
      description: "Creates a poll for people to react on",
      usage: "createpoll <question>, <date to end>, <options separated by spaces or commas>",
      category: "Polls"
    });
  }

  async exec(message) {
    const numDictionary = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const emoteDictionary = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "🇿"];

    const options = {};
    const questionsToAsk = [{
      name: "question",
      ask: "What is your question?",
      expected: () => true
    }, {
      name: "endDate",
      ask: "When do you want the poll to end? Answer \"never\" if you don't want the poll to end.",
      expected: answer => answer.includes("never") || chrono.parseDate(answer)
    }, {
      name: "choicesRaw",
      ask: "What are the choices for this poll (separated by a comma or space)?",
      expected: () => true
    }, {
      name: "choicesPerPerson",
      ask: "How many choices should each person get? Answer \"infinite\" to have no limit",
      expected: answer => answer.includes("infinite") || !isNaN(parseInt(answer))
    }]

    for (const questionToAsk of questionsToAsk) {
      while (!options[questionToAsk.name]) {
        await message.channel.send(questionToAsk.ask);
        const answer = await message.channel.awaitMessages(m => m.author == message.author, { max: 1, time: 20000 })

        if (answer.size == 0) {
          return message.channel.send("Timed out");
        }

        if (questionToAsk.expected(answer.first().content)) {
          options[questionToAsk.name] = answer.first().content;
        }
      }
    };

    let pollChoices = options.choicesRaw.split(",").filter(e => /\S/.test(e));
    if (!options.choicesRaw.includes(",")) {
      pollChoices = options.choicesRaw.split(" ").filter(e => /\S/.test(e));
    }

    const embedOutput = this.client.util.embed({
      color: '#0099ff',
      author: {
        name: message.member.displayName,
        icon_url: message.author.displayAvatarURL()
      },
      title: `Poll #${storedpollsJSON.get().length + 1} - ${options.question}`,
      fields: [{
        name: `**Anonymous    **`,
        value: "Disabled",
        inline: true
      }, {
        name: "**End Date    **",
        value: options.endDate ? options.endDate.toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" }) : "Never",
        inline: true
      }, {
        name: "Choices Per Person",
        value: numDictionary[parseInt(options.choicesPerPerson) - 1] ? numDictionary[parseInt(options.choicesPerPerson) - 1] : "infinite",
        inline: true
      }, {
        name: "Select your choices:",
        value: pollChoices.map((pollOption, i) => `${emoteDictionary[i]} ${pollOption} - 0 votes`).join("\n")
      }],
      thumbnail: {
        url: message.guild.iconURL()
      }
    });

    message.channel.send(embedOutput).then(newMessage => {
      pollChoices.forEach((e, i) => {
        newMessage.react(emoteDictionary[i]);
      });

      storedpollsJSON.append({ channel: newMessage.channel.id, id: newMessage.id, votes: pollChoices.map(e => { return { name: e, membersVoted: [] } }), endDate: options.endDate, choicesPerPerson: options.choicesPerPerson });
    });
  }

  async handleReaction(reaction, user, reactionType) {
    if (user == this.client.user) return;

    const numDictionary = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const emoteDictionary = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "🇿"];
    const storedpolls = storedpollsJSON.get();
    const storedReactionObjIndex = storedpolls.findIndex(e => e.id == reaction.message.id);
    const storedPoll = storedpolls[storedReactionObjIndex];

    if (!storedPoll || storedPoll.ended) return;
    const alreadyVotedMembers = storedPoll.votes.map(option => option.membersVoted).flat();

    await reaction.fetch();
    if (alreadyVotedMembers.filter(e => e == user.id).length >= storedpolls[storedReactionObjIndex].choicesPerPerson && reactionType == "add") {
      return reaction.users.remove(user).then(() => user.send("You have already voted in this poll."));
    }

    if (storedReactionObjIndex >= -1) {
      const emoteIndex = emoteDictionary.indexOf(reaction.emoji.name);

      const usersReacted = await reaction.users.fetch();
      storedpolls[storedReactionObjIndex].votes[emoteIndex].membersVoted = usersReacted.filter(user => user != this.client.user).map(user => user.id);
      storedpollsJSON.set(storedpolls);

      const newEmbed = reaction.message.embeds[0]
        .spliceFields(3, 25)
        .addField("Select one option:", storedpolls[storedReactionObjIndex].votes.map((storedReactionObj, i) =>
          `${emoteDictionary[i]} ${storedReactionObj.name} - ${storedReactionObj.membersVoted.length} votes`).join("\n"));

      reaction.message.edit(newEmbed);
    }
  }
}

module.exports = CreatePollCommand;