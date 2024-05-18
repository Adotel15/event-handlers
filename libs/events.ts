import { EventEmitter } from 'events';

import type { UserType } from '../types/user.js';

class EventsAPI extends EventEmitter {
    constructor() {
        super();

        this.on('create', ({ id, name, lastname }: UserType) => {
            console.log(`Created new user with id ${id}, ${name} ${lastname}!`);
        });

        this.on('update', ({ id, name, lastname }: UserType) => {
            console.log(`Updated user with id ${id}, ${name} ${lastname}!`);
        });

        this.on('delete', (id: number) => {
            console.log(`Deleted user with id ${id}!`);
        });
    }

    createUser(user: UserType): void {
        this.emit('create', user);
    }

    updateUser(user: UserType): void {
        this.emit('update', user);
    }

    deleteUser(id: number): void {
        this.emit('delete', id);
    }
}

export { EventsAPI };
