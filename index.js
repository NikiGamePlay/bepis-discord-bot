// Config and Discord.js
const config = require('./config.json');
const Discord = require('discord.js');

// Modules
const oc = require('./modules/ocounter');
const binds = require('./modules/binds');
const internal = require('./modules/internal');

// Discord client instance
var client = new Discord.Client();

// Modules' instances
var OCounterModule = new oc(client);
var InternalModule = new internal(client);
var BindsModule = new binds();

// On login
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Commands
var moduleCommands = {
  "bepis!help": InternalModule.help,
  "bepis!ping": InternalModule.ping,
  "bepis!shutdown": InternalModule.shutdown,
  "bepis!bindlist": BindsModule.listBinds,
  "bepis!bindadd": BindsModule.addBind,
  "bepis!bindrm": BindsModule.removeBind,
  "bepis!oleaderboard": OCounterModule.orank
};

// Creates an array of command names to be used by the help command inside InternalModule
function registerCmdsForHelp() {
  let arr = [];
  for (let cmd in moduleCommands) {
    arr.push(cmd);
  }
  InternalModule.registerCmds(arr);
}
registerCmdsForHelp();

// onmsg listeners
var onMsgListeners = [
  BindsModule.onmsg,
  OCounterModule.onmsg
];

// On message (entry point)
client.on('message', msg => {
  let sliced = msg.content.split(" ");

  for (let key in moduleCommands) {
    if (sliced[0] == key) {
      moduleCommands[key](msg);
    }
  }

  for (let listener in onMsgListeners)
    onMsgListeners[listener](msg);

});

// Login
client.login(config.token);
