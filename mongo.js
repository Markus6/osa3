const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as a argument');
    process.exit(1);
}

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema);

const password = process.argv[2];

const url = `mongodb+srv://macu:${password}@fullstacktest-jq3rl.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true });


if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    })
}

if (process.argv.length === 5) {

    const name = process.argv[3];
    const number = process.argv[4];


    const person = new Person({
        name: name,
        number: number
    });


    person.save().then(response => {
        console.log(`added ${response.name} number ${response.number} to phonebook`);
        mongoose.connection.close();
    });
}

