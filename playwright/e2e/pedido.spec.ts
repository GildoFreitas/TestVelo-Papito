import { test, expect } from '@playwright/test'
import { gerarCodigoPedido} from '../support/helpers'
import { OrderLookupPage } from '../support/pages/OrderLookupPage'


//AAA - Arrange, Act, Assert

test.describe('Consultar Pedido', () => {
  
  test.beforeEach(async ({ page }) => {
    //Arrange - Preparar o cenário
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
    await page.getByRole('link', { name: 'Consultar Pedido' }).click()
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  })

  test('Pedido Aprovado', async ({ page }) => {
    //Test Data

    const order = {
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
    const orderLookupPage = new OrderLookupPage(page)
    await orderLookupPage.searchOrder(order.number)

    //Assert - Verificar o resultado de textos
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: ${order.interior}
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `)

    //Assert - Verificar o resultado da badge de status
    const statusBadge = page.getByRole('status').filter({ hasText: order.status })
    await expect(statusBadge).toHaveClass(/bg-green-100/)
    await expect(statusBadge).toHaveClass(/text-green-700/)

    const statusIcon = statusBadge.locator('svg')
    await expect(statusIcon).toHaveClass(/lucide-circle-check/)
  })

  test('Pedido Reprovado', async ({ page }) => {
    //Test Data
    const order = {
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
    const orderLookupPage = new OrderLookupPage(page)
    await orderLookupPage.searchOrder(order.number)

    //Assert - Verificar o resultado
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: ${order.interior}
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `)

      //Assert - Verificar o resultado da badge de status
    const statusBadge = page.getByRole('status').filter({ hasText: order.status })
    await expect(statusBadge).toHaveClass(/bg-red-100/)
    await expect(statusBadge).toHaveClass(/text-red-700/)

    const statusIcon = statusBadge.locator('svg')
    await expect(statusIcon).toHaveClass(/lucide-circle-x/)
  })

  test('Pedido Em Análise', async ({ page }) => {
    //Test Data
    const order = {
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
    const orderLookupPage = new OrderLookupPage(page)
    await orderLookupPage.searchOrder(order.number) 

    //Assert - Verificar o resultado
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: ${order.interior}
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `)

    //Assert - Verificar o resultado da badge de status
    const statusBadge = page.getByRole('status').filter({ hasText: order.status })
    await expect(statusBadge).toHaveClass(/bg-amber-100/)
    await expect(statusBadge).toHaveClass(/text-amber-700/)

    const statusIcon = statusBadge.locator('svg')
    await expect(statusIcon).toHaveClass(/lucide-clock/)
  })

  test('Pedido não encontrado', async ({ page }) => {
    //Test Data
    const orderNumber = gerarCodigoPedido()

    //Act - Executar a ação
    const orderLookupPage = new OrderLookupPage(page)
    await orderLookupPage.searchOrder(orderNumber)

    //Assert - Verificar o resultado
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `)

  })
})