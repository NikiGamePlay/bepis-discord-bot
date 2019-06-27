/// "o" counter class
class OCounterModule {
    /// constructor, fancy JS stuff in here.
    /// accepts the Discord client reference used in it's methods
    /// .bind(this) is used to make "this.something" visible to the function; e.g. to use this.binds
    constructor(client) {
        this.client = client;
        this.leaderboard = new Object(); // initalize the leaderboard
        this.count = this.count.bind(this);
        this.onmsg = this.onmsg.bind(this);
        this.orank = this.orank.bind(this);
    }
    // Increments or makes new entry in OCounterArray
    count(msg) {
        if (this.leaderboard.hasOwnProperty(msg.author.id)) { // check whether the used exists in the registry
            this.leaderboard[msg.author.id]++; // if so, increment the O counter for this particular user
        }
        else {
            this.leaderboard[msg.author.id] = 1; // if this user isn't registered, make a new entry and set it to 1
        }
    }
    /// onmsg listener, executed on each message sent by the users
    onmsg(msg) {
        switch (msg.content) { // little switch, whether the message's content is 'o', "ó" etc.
            case 'o':
            case 'O':
            case 'Ó':
            case 'ó':
                this.count(msg); // if so, execute the count() method, passing the Message object
                break;
        }
    }
    /// Displays the leaderboard
    async orank(msg) {
        let str = "```\n"; // header
        for (let userId in this.leaderboard) { // loop for each user that has ever said an O or etc.
            let user = await this.client.users.fetch(userId); // fetch user's nickname
            str += user.username + " : " + this.leaderboard[userId] + "\n"; // add the username and the score to the list
        }
        str += "```"; // footer
        msg.channel.send(str); // send it to the channel
    }
}
/// export the class, to be used in index.js
module.exports = OCounterModule;