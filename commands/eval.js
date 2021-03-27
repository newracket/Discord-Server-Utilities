const fs = require("fs");

module.exports = {
  name: "eval",
  description: "Evaluates Commands",
  aliases: ["e"],
  execute(message, args, client) {
    if (message.author.id == "301200493307494400") {
      let output = eval(args.join(" "));
      if (output == undefined) {
        return message.channel.send("Output is undefined");
      }
      if (typeof output != "string") {
        output = output.toString();
      }
      const outputTexts = output.match(/.{1,1900}/g);

      outputTexts.forEach(outputText => {
        message.channel.send(outputText);
      });
    }
    else {
      message.channel.send("Syntax Error");
    }
  }
}