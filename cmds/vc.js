module.exports.run = async (bot, message, args) => {
  let vcBefore = args.join(" ");
  if (!vcBefore) return message.channel.send("wrong parameters");
  let vc;
  let channels = message.guild.channels.cache;
  if (parseInt(vcBefore)) {
    vc = message.guild.channels.cache.find((val) => val.id === vcBefore);
  } else {
    vc = message.guild.channels.cache.find((val) => val.name === vcBefore);
  }
  if (vc.type !== "voice")
    return message.channel.send("Bro that aint a voice channel");
  let members = vc.members;
  message.channel.send("Generating...").then((msg) => {
    let current = {};
    members.forEach((member) => {
      let memberRoles = member.roles.cache.filter(
        (r) => r.name !== "@everyone"
      );
      memberRoles.forEach((role) => {
        if (Object.keys(current).includes(role.id)) {
          current[role.id].has = current[role.id].has + 1;
        } else {
          current[role.id] = {
            roleID: role.id,
            has: 1,
          };
        }
      });
    });

    let final = "**Roles:**\n\n";
    Object.keys(current).forEach((roleID) => {
      final += `${
        message.guild.roles.cache.get(current[roleID].roleID).name
      } -- ${current[roleID].has}/${members.size} ${Math.floor(
        (current[roleID].has / members.size) * 100
      )}%\n`;
    });

    msg.edit(final);
  });
};

module.exports.help = {
  name: "vc",
};
