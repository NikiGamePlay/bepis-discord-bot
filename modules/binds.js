/// file system
const fs = require('fs');
/// locale
const locale = require('../config/locale.json');
/// commands
const commands = require('../config/commands.json');

/// class containing bind stuff
class BindsModule {
    /// constructor, fancy JS stuff.
    /// .bind(this) is used to make "this.something" visible to the function; e.g. to use this.binds
    constructor() {
        this.onmsg = this.onmsg.bind(this);
        this.addBind = this.addBind.bind(this);
        this.listBinds = this.listBinds.bind(this);
        this.removeBind = this.removeBind.bind(this);
        this.checkLoop = this.checkLoop.bind(this);
        this.onStartup = this.onStartup.bind(this);
        this.onShutdown = this.onShutdown.bind(this);
        this.binds = new Object(); // initalize a holder of the commands
    }
    /// Loads saved binds from binds.json (if exists)
    onStartup() {
        if (fs.existsSync('binds.json')) {
            let content = fs.readFileSync('binds.json', 'utf8');
            let json = JSON.parse(content);
            for (let key in json) {
                this.binds[key] = json[key];
            }
        }
    }
    /// Saves binds to the binds.json file
    onShutdown() {
        let binds = JSON.stringify(this.binds);
        fs.writeFile('binds.json', binds, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    /// creates a bind
    addBind(msg) {
        let noCommandString = msg.content.substring(commands.bindadd.length + 1); // we delete the 'bepis!bindadd' and the following whitespace
        try {
            let command = this.resolveCommand(noCommandString); // ---> command => output
            let output = this.resolveOutput(noCommandString); // command => output <---
            if (this.checkLoop(command, output)) { // check for loops
                msg.reply(locale.bindLoopError); // if one is found, send an error msg
                return; // and exit
            }
            this.binds[command] = output; // if no loops are found, add our bind to our object (JSON-like)
            let message = locale.bindCreateMessage.replace('%cmd', command).replace('%out', output);
            msg.channel.send(message) // send the confirmation to the channel of origin
        } catch (error) {
            msg.channel.send(error); // if any errors, display them to the user
        }
    }
    /// removes a bind from the binds object
    removeBind(msg) {
        let noCommandString = msg.content.substring(commands.bindremove.length + 1); // we delete the 'bepis!bindrm' and the following whitespace
        if (this.binds.hasOwnProperty(noCommandString)) { // we check whether this bind exists inside the binds object
            delete this.binds[noCommandString]; // if found, delete it
            msg.channel.send(locale.bindRemovalSuccess.replace('%bind', noCommandString)); // send the confirmation to the channel of origin
        }
        else {
            msg.channel.send(locale.bindRemovalNotFound.replace('%bind', noCommandString)); // if not found, send and error msg
        }
    }
    /// compiles and sends a list of the binds
    listBinds(msg) {
        let str = locale.bindAvailableBinds; // header of the message
        for (let bind in this.binds) { // we loop over binds, bind is the command
            str += '```"' + bind + '" => "' + this.binds[bind] + '"```'; // we make a fancy looking string which features the command and the output
        }
        msg.channel.send(str); // send the list to the channel
    }
    /// onmsg listener, executed on each message sent by any user
    onmsg(msg) {
        if (this.binds.hasOwnProperty(msg.content)) { // find whether the message is the bind trigger
            msg.channel.send(this.binds[msg.content]); // if so, 'execute'
        }
    }
    /// fancy loop checking
    /// true = loop found
    /// false = no loops found
    checkLoop(cmd, res) {
        if (cmd == res) { // if command is equal to the output
            return true;
        }
        for (let key in this.binds) {
            if (res == key) { // whether the output of this new bind would trigger any existing bind
                return true;
            }
            if (this.binds[key] == cmd) { // whether the output of another bind would trigger this one
                return true;
            }
        }
        return false; // if all fine, return false
    }
    /// grab the trigger from full text msg; we're grabbing this one => and ignoring this one
    /// returns the trigger (aka. command); e.g. "we're grabbing this one"
    resolveCommand(str) {
        let splitted = str.split('=>'); // split it, so we have an array of string like this one [" we're grabbing this one ", " and ignoring this one"]
        if (splitted[0].length == str.length || splitted.length !== 2) { // check for syntax errors, e.g. no "=>" sign
            throw locale.bindSyntaxError; // throw the error, later captured by the try/catch inside addBind()
        }
        let cmd = splitted[0].trim(); // select the first item of the array and remove whitespace from the beggining and the end; would return "we're grabbing this one"
        return cmd; // finally return
    }
    /// grab the output from full text msg; we're ignoring this one now => and grabbing this one
    /// returns the output (aka. value of the bind); e.g. "and grabbing this one"
    resolveOutput(str) {
        let splitted = str.split('=>'); // split it, so we have an array of string like this one [" we're ignoring this one now ", " and grabbing this one"]
        if (splitted[0].length == str.length || splitted.length !== 2) { // check for syntax errors, e.g. no "=>" sign // SIDE-NOTE: technically not needed anymore
            throw locale.bindSyntaxError; // throw the error, later captured by the try/catch inside addBind()
        }
        let out = splitted[1].trim(); // select the 2nd item of the array and remove whitespace from the beggining and the end; would return "and grabbing this one"
        return out; // finally return
    }
}
/// export the class, to be used in index.js
module.exports = BindsModule;