const vue = Vue.createApp({
    data() {
        return {
            coffeeInModal: { name: null },
            coffees: [],
            newCoffee: { name: '', description: '', quantity: '', size: '', paymentmethod: '' }
        }
    },
    async created() {
        this.coffees = await (await fetch('http://localhost:8080/coffees')).json();
    },
    methods: {
        getCoffee: async function (id) {
            this.coffeeInModal = await (await fetch(`http://localhost:8080/coffees/${id}`)).json();
            let coffeeInfoModal = new bootstrap.Modal(document.getElementById('coffeeInfoModal'), {})
            coffeeInfoModal.show()
        },
        deleteCoffee: async function (id) {
            await fetch(`http://localhost:8080/coffees/${id}`, {
                method: 'DELETE'
            });
            this.coffees = await (await fetch('http://localhost:8080/coffees')).json();
        },
        addCoffee: async function () {
            await fetch('http://localhost:8080/coffees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.newCoffee)
            });

            this.newCoffee.name = '';
            this.newCoffee.description = '';
            this.newCoffee.quantity = '';
            this.newCoffee.size = '';
            this.newCoffee.paymentmethod = '';

            this.coffees = await (await fetch('http://localhost:8080/coffees')).json();

            this.coffeeInModal = { ...this.newCoffee };
        },
        editCoffeeModal: async function () {
            let coffeeEditModal = new bootstrap.Modal(document.getElementById('coffeeEditModal'), {});
            coffeeEditModal.show();
        },
        editCoffee: async function () {
            await fetch(`http://localhost:8080/coffees/${this.coffeeInModal.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.coffeeInModal.name,
                    description: this.coffeeInModal.description,
                    quantity: this.coffeeInModal.quantity,
                    size: this.coffeeInModal.size,
                    paymentmethod: this.coffeeInModal.paymentmethod
                })
            });

            this.coffees = await (await fetch('http://localhost:8080/coffees')).json();
        }
    }
}).mount('#app');
