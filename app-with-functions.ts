import fs from 'fs/promises';
import events from 'events';
import ioService from 'readline';

import { print } from './helpers/print.js';

import type { UserType } from './types/user.js';

// IO Interface
const ioHandler = ioService.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Event emitter
const eventEmitterService = new events.EventEmitter();

eventEmitterService.on('newUser', ({ id, name, lastname }: UserType) => {
    console.log(`Created new user with id ${id}, ${name} ${lastname}!`);
});

eventEmitterService.on('updatedUser', ({ id, name, lastname }: UserType) => {
    console.log(`Updated user with id ${id}, ${name} ${lastname}!`);
});

eventEmitterService.on('deletedUser', ({ id, name, lastname }: UserType) => {
    console.log(`Deleted user with id ${id}, ${name} ${lastname}!`);
});

const prompt = (query: string): Promise<string> => {
    return new Promise((resolve) => ioHandler.question(query, resolve));
};

const getUser = async () => {
    const data = JSON.parse(await fs.readFile('./db.json', 'utf-8'));

    if (!Array.isArray(data)) {
        throw new Error('JSON file does not contain an array');
    }

    return data;
};

const saveUsers = async (data: UserType[]) => {
    fs.writeFile('./db.json', JSON.stringify(data), 'utf-8');
};

let optionSelected: number;

let name: string = '';
let lastname: string = '';

(async () => {
    print();
    optionSelected = Number(await prompt('Select an option: '));

    while (optionSelected !== -1 || Number.isNaN(optionSelected)) {
        switch (optionSelected) {
            case 1:
                try {
                    name = await prompt('Introduce name: ');
                    lastname = await prompt('Introduce lastname: ');

                    const users = await getUser();

                    users.push({
                        id: users.length,
                        name,
                        lastname,
                    } satisfies UserType);

                    await saveUsers(users);

                    eventEmitterService.emit('newUser', {
                        id: users.length,
                        name,
                        lastname,
                    });
                } catch (error) {
                    console.log(error);
                }
                break;
            case 2:
                try {
                    console.log(await getUser());
                } catch (error) {
                    console.log('Error connecting to db!');
                }
                break;
            case 3:
                try {
                    const id = Number(await prompt('Introduce user ID: '));

                    if (Number.isNaN(id)) {
                        console.log('Introduce a valid number!');
                        return;
                    }

                    const users = await getUser();

                    const updatedUsers = [];

                    for (const user of users) {
                        if (user.id !== id) updatedUsers.push(user);
                        else {
                            console.log(`Updating user ${user.id}`);
                            console.log(user);

                            name = await prompt('Introduce name: ');
                            lastname = await prompt('Introduce lastname: ');
                            updatedUsers.push({ id: user.id, name, lastname });

                            eventEmitterService.emit('updatedUser', {
                                id: user.id,
                                name,
                                lastname,
                            });
                        }
                    }

                    await saveUsers(updatedUsers);
                } catch (error) {
                    console.log('Error connecting to db!');
                }
                break;
            case 4:
                try {
                    const id = Number(await prompt('Introduce user ID: '));

                    if (Number.isNaN(id)) {
                        console.log('Introduce a valid number!');
                        return;
                    }

                    const users = await getUser();

                    const updatedUsers = [];

                    for (const user of users) {
                        if (user.id !== id) updatedUsers.push(user);
                    }

                    await saveUsers(updatedUsers);
                    eventEmitterService.emit('deletedUser', {
                        id,
                        name,
                        lastname,
                    });
                } catch (error) {
                    console.log(error);
                }

                break;
            default:
                break;
        }
        print();
        optionSelected = Number(await prompt('Select an option: '));
    }
    ioHandler.close();
})();

ioHandler.on('close', () => console.log(`Goodbye motherfuckers!`));