// Configs and Discord.js
const config = require('./config/config.json');
const commands = require('./config/commands.json');
const locale = require('./config/locale.json');
const Discord = require('discord.js');

// Modules
const oc = require('./modules/ocounter');
const binds = require('./modules/binds');
const internal = require('./modules/internal');

// Discord client instance
const client = new Discord.Client();

// Modules' instances
const OCounterModule = new oc(client);
const InternalModule = new internal(client);
const BindsModule = new binds();

// onmsg listeners
const onMsgListeners = [
  BindsModule.onmsg,
  OCounterModule.onmsg
];

// onstartup listeners
const onStartupListeners = [
  BindsModule.onStartup,
  InternalModule.onStartup
];

// onshutdown listeners
const onShutdownListeners = [
  BindsModule.onShutdown
];

// String to function map
const moduleCommandPointers = {
  [commands.help]: InternalModule.help,
  [commands.ping]: InternalModule.ping,
  [commands.shutdown]: botShutdown,
  [commands.bindlist]: BindsModule.listBinds,
  [commands.bindadd]: BindsModule.addBind,
  [commands.bindremove]: BindsModule.removeBind,
  [commands.oleaderboard]: OCounterModule.orank
};

// on shutdown event, executes after the bepis!shutdown command
async function botShutdown(msg) {
  if (msg.author.id == config.botowner) {
    for (let listener in onShutdownListeners) // execute onShutdown stuff
      onShutdownListeners[listener]();
    await msg.channel.send(locale.internalShutdown); // wait for the message to be send
    client.destroy();// after the message has been sent, log out from Discord
    process.exit(0); // finally exit the application
  }
  else
  {
    msg.reply(locale.internalUnauthorized);
  }
}

// On login
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  for (let listener in onStartupListeners)
    onStartupListeners[listener]();
});

// On message (entry point)
client.on('message', msg => {
  let sliced = msg.content.split(" ");

  for (let key in moduleCommandPointers) {
    if (sliced[0] == key) {
      moduleCommandPointers[key](msg);
    }
  }

  for (let listener in onMsgListeners)
    onMsgListeners[listener](msg);

});

// Login
client.login(config.token);
