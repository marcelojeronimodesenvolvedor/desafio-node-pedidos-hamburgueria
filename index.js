const { request, response } = require('express')
const express = require('express')
const uuid = require('uuid')

const app = express()
const port = 3000
app.use(express.json())

const orders = []

const showMethodAndurl = (request, response, next) => {

    const method = request.method
    const url = request.url

    console.log(`Esse é o método: ${method} seguido desta URL: ${url}`)
    next()
}

const checkOrdersId = (request, response, next) => {

    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {

        return response.status(404).json({ Error: "Request not found" })
    }


    request.orderIndex = index
    request.orderId = id

    next()
}


app.get('/orders', showMethodAndurl, (request, response) => { // get rota criada

    console.log('orders')

    return response.json(orders)

})

app.get('/orders/:id', checkOrdersId, showMethodAndurl, (request, response) => { // get id rota criada

    const index = request.orderIndex

    return response.json(orders[index])
})

app.post('/orders', showMethodAndurl, (request, response) => {// post rota criada

    const { order, clientName, price } = request.body

    const newOrder = { id: uuid.v4(), order, clientName, price, status: "Order Placed" }


    orders.push(newOrder)

    return response.status(201).json(newOrder)
})
app.put('/orders/:id', checkOrdersId, showMethodAndurl, (request, response) => { // put rota criada

    const index = request.orderIndex
    const id = request.orderId

    const { order, clientName, price } = request.body

    const updateOrder = { id, order, clientName, price, status: "Order in Preparation" }

    orders[index] = updateOrder

    return response.json(updateOrder)
})
app.delete('/orders/:id', showMethodAndurl, checkOrdersId, (request, response) => { // delete rota criada

    const index = request.orderIndex
    const id = request.orderId

    orders.splice(index, 1)

    return response.status(204).json()
})
app.patch('/orders/:id', checkOrdersId, showMethodAndurl, (request, response) => { // patch rota criada

    const index = request.orderIndex
    const id = request.orderId

    const { order, clientName, price } = request.body

    const orderStatus = { id, order, clientName, price, status: "Your order is ready" }

    orders[index] = orderStatus

    console.log(orderStatus)

    return response.json(orderStatus)
})




app.listen(3000, () => {
    console.log(`Server started on port ${port}`)
})