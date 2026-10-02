import { test } from '../support/fixtures'
import { gerarCodigoPedido } from '../support/helpers'
import { OrderDetails } from '../support/actions/orderLookupActions'


//AAA - Arrange, Act, Assert

test.describe('Consultar Pedido', () => {

    test.beforeEach(async ({ app }) => {
        //Arrange - Preparar o cenário
        await app.orderLookup.open()
    })

    test('Pedido Aprovado', async ({ app }) => {
        //Test Data
        const order: OrderDetails = {
            number: 'VLO-G7OU8O',
            color: 'Glacier Blue',
            interior: 'cream',
            wheels: 'sport Wheels',
            customer: {
                name: 'Abel Freitas',
                email: 'teste@teste.com',
            },
            payment: 'À Vista',
            status: 'APROVADO',
        }

        //Act - Executar a ação
        await app.orderLookup.searchOrder(order.number)

        //Assert - Verificar o resultado
        await app.orderLookup.validateOrderDetails(order)
        await app.orderLookup.validateStatusBadge(order.status)
    })

    test('Pedido Reprovado', async ({ app }) => {
        //Test Data
        const order: OrderDetails = {
            number: 'VLO-NHDCIO',
            color: 'Glacier Blue',
            interior: 'cream',
            wheels: 'sport Wheels',
            customer: {
                name: 'Gildo Freitas',
                email: 'teste@teste.com',
            },
            payment: 'À Vista',
            status: 'REPROVADO',
        }

        //Act - Executar a ação
        await app.orderLookup.searchOrder(order.number)

        //Assert - Verificar o resultado
        await app.orderLookup.validateOrderDetails(order)
        await app.orderLookup.validateStatusBadge(order.status)
    })

    test('Pedido Em Análise', async ({ app }) => {
        //Test Data
        const order: OrderDetails = {
            number: 'VLO-LP245L',
            color: 'Lunar White',
            interior: 'cream',
            wheels: 'sport Wheels',
            customer: {
                name: 'Isa Falcão',
                email: 'teste@teste.com',
            },
            payment: 'À Vista',
            status: 'EM_ANALISE',
        }

        //Act - Executar a ação
        await app.orderLookup.searchOrder(order.number)

        //Assert - Verificar o resultado
        await app.orderLookup.validateOrderDetails(order)
        await app.orderLookup.validateStatusBadge(order.status)
    })

    test('Pedido não encontrado', async ({ app }) => {
        //Test Data
        const orderNumber = gerarCodigoPedido()

        //Act - Executar a ação
        await app.orderLookup.searchOrder(orderNumber)

        //Assert - Verificar o resultado
        await app.orderLookup.validateOrderNotFound()
    })

    test('Pedido em formato não padrão', async ({ app }) => {
        //Test Data
        const orderNumber = '123'

        //Act - Executar a ação
        await app.orderLookup.searchOrder(orderNumber)

        //Assert - Verificar o resultado
        await app.orderLookup.validateOrderNotFound()
    })
})
