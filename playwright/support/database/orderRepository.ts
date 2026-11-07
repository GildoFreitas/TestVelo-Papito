import crypto from 'crypto'
import type { OrderDetails } from '../actions/orderLookupActions'
import { db } from './database'
import type { OrderTable } from './schema'

// 'Glacier Blue' -> 'glacier-blue'
function toColorSlug(color: string) {
    return color.trim().toLowerCase().replace(/\s+/g, '-')
}

// 'sport Wheels' -> 'sport'
function toWheelType(wheels: string) {
    return wheels.trim().split(/\s+/)[0].toLowerCase()
}

export async function insertOrder(order: OrderDetails) {
    const data: OrderTable = {
        id: crypto.randomUUID(),
        order_number: order.number,
        color: toColorSlug(order.color),
        wheel_type: toWheelType(order.wheels),
        customer_name: order.customer.name,
        customer_email: order.customer.email,
        customer_phone: order.customer.phone,
        customer_cpf: order.customer.document,
        payment_method: order.payment === 'À Vista' ? 'avista' : 'financiamento',
        total_price: order.total_price,
        status: order.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        optionals: [],
    }

    // Se o pedido já existir, o insert falharia por duplicidade; por isso os testes
    // chamam deleteOrderByNumber antes.
    await db.insertInto('orders').values(data).execute()
}

export async function deleteOrderByNumber(orderNumber: string) {
    await db.deleteFrom('orders').where('order_number', '=', orderNumber).execute()
}

// Para pedidos criados pelo próprio app (número aleatório), onde não há um número fixo
// para apagar: o e-mail do cliente de teste é a chave de limpeza.
export async function deleteOrdersByEmail(email: string) {
    await db.deleteFrom('orders').where('customer_email', '=', email).execute()
}
