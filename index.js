const { Client, Collection } = require("discord.js");
const client = new Client();
const config = require("./config.json");

client.cmds = new Collection();
const fs = require("fs");
fs.readdir("./cmds/", (err, files) => {
  if (err) console.log(err);

  let jsfile = files.filter((f) => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("Err: Could not find commands.");
    return;
  }
  jsfile.forEach((f, i) => {
    let prop = require(`./cmds/${f}`);
    console.log(`${f} loaded!`);
    client.cmds.set(prop.help.name, prop);
  });
});

client.on("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  if (message.channel.type === "dm") return;
  if (message.author.bot) return;
  let prefix = "!";
  if (!message.content.startsWith(prefix)) return;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let cmdFile = client.cmds.get(cmd.slice(prefix.length));
  if (cmdFile) cmdFile.run(client, message, args);
});

client.login(config.token);
