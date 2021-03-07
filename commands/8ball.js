module.exports = {
  name: "8ball",
  description: "8ball (totally not rigged)",
  aliases: ["8"],
  execute(message, args, client) {
    const casWords = ["cas", "bad", "garbage", "trash", "garbonzo", "dogshit"];
    const sweatyWords = ["good", "amazing", "sweat", "sweaty"];
    const names = ["justin", "john", "alan", "achintya", "oscar", "aaron", "david", "gio", "eric"];
    const reverseWords = ["no", "not"];
    let messageToSend = true;

    if (message.author.username == "newracketa") {
      messageToSend = true;
      if (message.content.includesWords(names)) {
        messageToSend = !messageToSend;
      }
      if (!message.content.includesWords(casWords)) {
        messageToSend = !messageToSend;
      }
      if (message.content.includesWords(reverseWords)) {
        messageToSend = !messageToSend;
      }
    }
    else {
      messageToSend = false;
      if (message.content.includes("aniket")) {
        messageToSend = !messageToSend;
      }
      if (!message.content.includesWords(casWords)) {
        messageToSend = !messageToSend;
      }
      if (message.content.includesWords(reverseWords)) {
        messageToSend = !messageToSend;
      }
    }

    if (messageToSend) {
      message.channel.send("Yes");
    }
    else {
      message.channel.send("No");
    }
  }
}

String.prototype.includesWords = function (words) {
  return words.filter(word => this.includes(word)).length > 0;
};