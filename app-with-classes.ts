// import { Users } from './libs/users.js';

// import { print } from './helpers/print.js';

// const main = async () => {
//     const UserClass = new Users();

//     let optionSelected: number;

//     print();
//     optionSelected = Number(await UserClass.prompt('Select an option: '));

//     while (optionSelected !== -1 || Number.isNaN(optionSelected)) {
//         switch (optionSelected) {
//             case 1:
//                 await UserClass.createUser();
//                 break;
//             case 2:
//                 console.log(await UserClass.getUser());
//                 break;
//             case 3:
//                 await UserClass.updateUser();
//                 break;
//             case 4:
//                 await UserClass.deleteUser();
//             default:
//                 break;
//         }
//         print();
//         optionSelected = Number(await UserClass.prompt('Select an option: '));
//     }
// };

// main();


type color = 'blue';
var color = 'blue';

const test: color = 'blue';

console.log(typeof color);

const greetingType = 'helloWorld';

class Greetings {
    greetingType() {
        return 'Hello, World!';
    }
}
