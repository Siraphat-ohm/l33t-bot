# L33tbot

This project is a Discord bot that posts daily Leetcode questions to a specific channel in each server it is added to. The bot also responds to basic commands and manages the creation of a dedicated channel for Leetcode discussions.

## Features
- Daily Leetcode Questions: Posts a random "Easy" Leetcode question every day at midnight.
- Ping Command: Responds with a humorous message to the /ping command.
- Automatic Channel Creation: Creates a #leetcode channel in any server the bot is added to and stores the channel IDs in a JSON file.

## Installation

### Prerequisites
- Node.js (v14.x or later)
- npm (v6.x or later)

### Setup

1. Clone the repository:
```bash
$ git clone https://github.com/yourusername/leetcode-bot.git
$ cd leetcode-bot
```

2. Install dependencies:
```bash
# via npm
$ npm i
# via yarn
$ yarn install
```

3. Configure the bot:
- Create a .env file in the root directory of the project folllow by `.env.example`

4. Run the bot:
```bash
$ yarn build
$ yarn start
```