/// class containing internal stuff
class InternalModule {
    /// constructor, fancy JS stuff.
    /// .bind(this) is used to make "this.something" visible to the function; e.g. to use this.binds
    constructor(client){
        this.client = client;
        this.commandList = [];
        this.shutdown = this.shutdown.bind(this);
        this.help = this.help.bind(this);
        this.registerCmds = this.registerCmds.bind(this);
    }
    /// bepis!shutdown
    /// logs out from Discord and exits the app
    /// async keyword, because we want to be 100% sure that the message about shutdown has been delivered
    async shutdown(msg) {
        await msg.channel.send('Shutting down!'); // wait for the message to be send
        this.client.destroy(); // after the message has been sent, log out from Discord
        process.exit(0); // finally exit the application
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