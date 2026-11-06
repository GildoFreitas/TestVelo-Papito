import { test, expect } from '../support/fixtures'
import { gerarCodigoPedido } from '../support/helpers'
import { OrderDetails } from '../support/actions/orderLookupActions'
import { closeDb } from '../support/database/database'
import { deleteOrderByNumber, insertOrder } from '../support/database/orderRepository'
import orders from '../support/fixtures/orders.json' with { type: 'json' }


//AAA - Arrange, Act, Assert

test.describe('Consultar Pedido', () => {

    // Os pedidos ficam no banco depois dos testes; só a conexão é encerrada.
    test.afterAll(async () => {
        await closeDb()
    })

    test.beforeEach(async ({ app }) => {
        //Arrange - Preparar o cenário
        await app.orderLookup.open()
    })

    test('Pedido Aprovado', async ({ app }) => {
        //Test Data
        const order = orders.approved as OrderDetails

        await deleteOrderByNumber(order.number)
        await insertOrder(order)

        //Act - Executar a ação
        await app.orderLookup.searchOrder(order.number)

        //Assert - Verificar o resultado
        await app.orderLookup.validateOrderDetails(order)
        await app.orderLookup.validateStatusBadge(order.status)
    })

    test('Pedido Reprovado', async ({ app }) => {
        //Test Data
        const order = orders.rejected as OrderDetails

        await deleteOrderByNumber(order.number)
        await insertOrder(order)

        //Act - Executar a ação
        await app.orderLookup.searchOrder(order.number)

        //Assert - Verificar o resultado
        await app.orderLookup.validateOrderDetails(order)
        await app.orderLookup.validateStatusBadge(order.status)
    })

    test('Pedido Em Análise', async ({ app }) => {
        //Test Data
        const order = orders.under_analysis as OrderDetails

        await deleteOrderByNumber(order.number)
        await insertOrder(order)

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

    test('Consulta em branco ou só com espaços', async ({ app }) => {
        //Assert - Botão desabilitado com campo vazio
        await expect(app.orderLookup.elements.searchButton).toBeDisabled()

        //Act - Preencher só com espaços
        await app.orderLookup.elements.orderInput.fill('      ')

        //Assert - Botão continua desabilitado
        await expect(app.orderLookup.elements.searchButton).toBeDisabled()
    })
})
