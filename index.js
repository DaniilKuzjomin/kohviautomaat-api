const express = require('express')
const cors = require('cors')
const app = express()
const port = 8080
const swaggerUi = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load('./docs/swagger.yaml');

app.use(cors())
app.use(express.json())

const coffees = [
    { id: 1, name: "Espresso", description: "Strong and bold coffee", quantity: "10",  size: "Big", paymentmethod: "Card" },
    { id: 2, name: "Latte", description: "Coffee with steamed milk", quantity: "6",  size: "Medium", paymentmethod: "Cash" },
    { id: 3, name: "Cappuccino", description: "Coffee with steamed milk foam and cocoa", quantity: "24",  size: "Small", paymentmethod: "Card" },
    { id: 4, name: "Americano", description: "Espresso diluted with hot water", quantity: "56",  size: "Small", paymentmethod: "Cash" },
    { id: 5, name: "Mocha", description: "Coffee with intense aroma", quantity: "2",  size: "Big", paymentmethod: "Cash" },
    { id: 6, name: "Flat White", description: "Coffee with milk without foam", quantity: "30",  size: "Big", paymentmethod: "Card, Cash" },
    { id: 7, name: "Macchiato", description: "Espresso with a dollop of steamed milk", quantity: "22",  size: "Medium", paymentmethod: "Cash" },
    { id: 8, name: "Raf", description: "Coffee with milk and vanilla syrup", quantity: "8",  size: "Medium", paymentmethod: "Card"  }
];


app.get('/coffees', (req, res)=>{
    res.send(coffees)
})

app.get('/coffees/:id', (req, res)=>{
    if (typeof coffees[req.params.id - 1] === 'undefined') {
        return res.status(404).send({error: "Coffee not found"})
    }

    res.send(coffees[req.params.id - 1])
})

app.post('/coffees', (req, res) => {
    if(!req.body.name || !req.body.description || !req.body.quantity || !req.body.size || !req.body.paymentmethod ){
        return res.status(400).send({error: 'One or all params are missing'})
    }
    let coffee = {
        id: coffees.length + 1,
        description: req.body.description,
        name: req.body.name,
        quantity: req.body.quantity,
        size: req.body.size,
        paymentmethod: req.body.paymentmethod
    }

    coffees.push(coffee)

    res.status(201)
        .location(`${getBaseUrl(req)}/coffees/${coffees.length}`)
        .send(coffee)
})

app.delete('/coffees/:id', (req, res) => {
    if (typeof coffees[req.params.id - 1] === 'undefined') {
        return res.status(404).send({ error: "Coffee not found" });
    }
    coffees.splice(req.params.id - 1, 1);
    res.status(204).send({ error: "No content" });
})

app.put('/coffees/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const coffeeIndex = coffees.findIndex(coffee => coffee.id === id);

    if (coffeeIndex === -1) {
        return res.status(404).send({ error: "Coffee not found" });
    }

    const updatedCoffee = {
        id: id,
        name: req.body.name || coffees[coffeeIndex].name,
        description: req.body.description || coffees[coffeeIndex].description,
        quantity: req.body.quantity || coffees[coffeeIndex].quantity,
        size: req.body.size || coffees[coffeeIndex].size,
        paymentmethod: req.body.paymentmethod || coffees[coffeeIndex].paymentmethod
    };

    coffees[coffeeIndex] = updatedCoffee;
    res.send(updatedCoffee);
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
    console.log(`Api up at: http://localhost:${port}`)
})

function getBaseUrl(req){
    return req.connection && req.connection.encrypted ? 'https' : 'http' + `://${req.header.host}`
}