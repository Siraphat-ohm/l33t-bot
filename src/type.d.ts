import { Collection } from 'discord.js';
import Command from './class/Command';

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, Command>;
    }
}

