import ioService from 'readline';

class IOInterface {
    ioHandler: ioService.Interface;

    constructor() {
        this.ioHandler = ioService.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    prompt = (query: string): Promise<string> => {
        return new Promise((resolve) =>
            this.ioHandler.question(query, resolve)
        );
    };
}

export { IOInterface };
