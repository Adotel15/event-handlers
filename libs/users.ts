import fs from 'fs/promises';

import { IOInterface } from './ioInterface.js';
import { EventsAPI } from './events.js';

import type { UserType } from '../types/user.js';

class Users {
    eventEmmiter;
    ioInterface;

    constructor() {
        this.ioInterface = new IOInterface();
        this.eventEmmiter = new EventsAPI();

        this.ioInterface.ioHandler.on('close', () => {
            console.log('App is closing...');
        });
    }

    // TODO: Change this
    prompt = async (prompt: string) => {
        return this.ioInterface.prompt(prompt);
    };

    saveUsers = async (data: UserType[]) => {
        fs.writeFile('./db.json', JSON.stringify(data), 'utf-8');
    };

    getUser = async (): Promise<UserType[]> => {
        const data: UserType[] = JSON.parse(
            await fs.readFile('./db.json', 'utf-8')
        );

        if (!Array.isArray(data)) {
            throw new Error('JSON file does not contain an array');
        }

        return data;
    };

    createUser = async () => {
        try {
            const name = await this.ioInterface.prompt('Introduce name: ');
            const lastname = await this.ioInterface.prompt(
                'Introduce lastname: '
            );

            const users = await this.getUser();

            users.push({
                id: users.length,
                name,
                lastname,
            } satisfies UserType);

            await this.saveUsers(users);

            this.eventEmmiter.createUser({
                id: users.length,
                name,
                lastname,
            });
        } catch (error) {
            console.log(error);
        }
    };

    updateUser = async () => {
        try {
            const id = Number(
                await this.ioInterface.prompt('Introduce user ID: ')
            );

            if (Number.isNaN(id)) {
                console.log('Introduce a valid number!');
                return;
            }

            const users = await this.getUser();

            const updatedUsers = [];

            for (const user of users) {
                if (user.id !== id) updatedUsers.push(user);
                else {
                    console.log(`Updating user ${user.id}`);
                    console.log(user);

                    const name = await this.ioInterface.prompt(
                        'Introduce name: '
                    );
                    const lastname = await this.ioInterface.prompt(
                        'Introduce lastname: '
                    );
                    updatedUsers.push({ id: user.id, name, lastname });

                    this.eventEmmiter.updateUser({
                        id: user.id,
                        name,
                        lastname,
                    });
                }
            }

            await this.saveUsers(updatedUsers);
        } catch (error) {
            console.log('Error connecting to db!');
        }
    };

    deleteUser = async () => {
        try {
            const id = Number(
                await this.ioInterface.prompt('Introduce user ID: ')
            );

            if (Number.isNaN(id)) {
                console.log('Introduce a valid number!');
                return;
            }

            const users = await this.getUser();

            const updatedUsers = [];

            for (const user of users) {
                if (user.id !== id) updatedUsers.push(user);
            }

            await this.saveUsers(updatedUsers);
            this.eventEmmiter.deleteUser(id);
        } catch (error) {
            console.log(error);
        }
    };
}

export { Users };
