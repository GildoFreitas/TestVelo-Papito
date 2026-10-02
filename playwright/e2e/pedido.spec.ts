import { test } from '../support/fixtures'
import { gerarCodigoPedido } from '../support/helpers'
import { OrderDetails } from '../support/pages/OrderLookupPage'


//AAA - Arrange, Act, Assert

test.describe('Consultar Pedido', () => {

    test.beforeEach(async ({ landingPage, navbar, orderLookupPage }) => {
        //Arrange - Preparar o cenário
        await landingPage.goto()
        await navbar.clickConsultarPedido()
        await orderLookupPage.validatePageLoaded()
    })

    test('Pedido Aprovado', async ({ orderLookupPage }) => {
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
        await orderLookupPage.searchOrder(order.number)

        //Assert - Verificar o resultado
        await orderLookupPage.validateOrder(order)
    })

    test('Pedido Reprovado', async ({ orderLookupPage }) => {
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
        await orderLookupPage.searchOrder(order.number)

        //Assert - Verificar o resultado
        await orderLookupPage.validateOrder(order)
    })

    test('Pedido Em Análise', async ({ orderLookupPage }) => {
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
        await orderLookupPage.searchOrder(order.number)

        //Assert - Verificar o resultado
        await orderLookupPage.validateOrder(order)
    })

    test('Pedido não encontrado', async ({ orderLookupPage }) => {
        //Test Data
        const orderNumber = gerarCodigoPedido()

        //Act - Executar a ação
        await orderLookupPage.searchOrder(orderNumber)

        //Assert - Verificar o resultado
        await orderLookupPage.validateOrderNotFound()
    })

    test('Pedido em formato não padrão', async ({ orderLookupPage }) => {
        //Test Data
        const orderNumber = '123'

        //Act - Executar a ação
        await orderLookupPage.searchOrder(orderNumber)

        //Assert - Verificar o resultado
        await orderLookupPage.validateOrderNotFound()
    })
})
