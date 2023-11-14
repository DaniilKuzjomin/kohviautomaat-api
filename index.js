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
    { id: 1, name: "Espresso", description: "Strong and bold coffee" },
    { id: 2, name: "Latte", description: "Coffee with steamed milk" },
    { id: 3, name: "Cappuccino", description: "Coffee with steamed milk foam and cocoa" },
    { id: 4, name: "Americano", description: "Espresso diluted with hot water" },
    { id: 5, name: "Mocha", description: "Coffee with intense aroma" },
    { id: 6, name: "Flat White", description: "Coffee with milk without foam" },
    { id: 7, name: "Macchiato", description: "Espresso with a dollop of steamed milk" },
    { id: 8, name: "Raf", description: "Coffee with milk and vanilla syrup" }
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
    if(!req.body.name || !req.body.description){
        return res.status(400).send({error: 'One or all params are missing'})
    }
    let coffee = {
        id: coffees.length + 1,
        description: req.body.description,
        name: req.body.name
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
        description: req.body.description || coffees[coffeeIndex].description
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