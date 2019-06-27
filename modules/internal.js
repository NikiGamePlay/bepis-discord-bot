/// class containing internal stuff
class InternalModule {
    /// constructor, fancy JS stuff.
    /// .bind(this) is used to make "this.something" visible to the function; e.g. to use this.binds
    constructor(client){
        this.client = client;
        this.commandList = [];
        this.help = this.help.bind(this);
        this.registerCmds = this.registerCmds.bind(this);
    }
    /// ping, replies with pong! to the user
    ping(msg){
        msg.reply('pong!');
    }
    /// prints out a list of available commands
    help(msg){
        let str = 'Available commands:\n```\n'; // header
        for (let cmd in this.commandList){ // loop over commands
            str += this.commandList[cmd] + "\n"; // add command name to the list
        }
        str += '```'; // footer
        msg.channel.send(str); // send it to the channel
    }
    /// used to copy the command list to an array, without function references
    registerCmds(cmdArr){
        this.commandList = cmdArr;
    }

}
/// exports module, to be used in index.js
module.exports = InternalModule;