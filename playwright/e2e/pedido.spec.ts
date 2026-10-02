import { test, expect } from '@playwright/test';
import { gerarCodigoPedido } from '../support/helpers';

//AAA - Arrange, Act, Assert

test.describe('Consultar Pedido', () => {
  
  test.beforeEach(async ({ page }) => {
    console.log('beforeEach: roda antes de cada teste.')
        //Arrange - Preparar o cenário
        await page.goto('http://localhost:5173/');
        await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
        await page.getByRole('link', { name: 'Consultar Pedido' }).click()
        await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  })

  test('Pedido válido', async ({ page }) => {
    //Test Data
    const orderNumber = 'VLO-G7OU8O'

    //Act - Executar a ação
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderNumber)
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    //Assert - Verificar o resultado
    // const containerPedido = page.getByRole('paragraph')
    //   .filter({ hasText: /^Pedido$/ })
    //   .locator('..') //Sobe para o elemento pai (a div que agrupa ambos)
    // await expect(containerPedido).toContainText(orderNumber), { timeout: 10000 }

    // const statusPedido = page.getByText(/^(APROVADO|REPROVADO|EM_ANALISE)$/) //Selo do status, qualquer que seja o valor
    // await expect(statusPedido).toHaveText('APROVADO')
    await expect(page.getByTestId(`order-result-${orderNumber}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${orderNumber}
      - img
      - text: APROVADO
      `)
    await expect(page.getByTestId(`order-result-${orderNumber}`)).toMatchAriaSnapshot(`
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: Glacier Blue
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: sport Wheels
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: Abel Freitas
      - paragraph: Email
      - paragraph: teste@teste.com
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: À Vista
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `)
  })

  test('Pedido não encontrado', async ({ page }) => {
    //Test Data
    const orderNumber = gerarCodigoPedido()

    //Act - Executar a ação
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderNumber)
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    //Assert - Verificar o resultado
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `)

  })
})