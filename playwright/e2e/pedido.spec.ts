import { test, expect } from '@playwright/test';

//AAA - Arrange, Act, Assert

test('deve consultar um pedido válido', async ({ page }) => {
  //Arrange - Preparar o cenário
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  //Act - Executar a ação
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-G7OU8O');
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  //Assert - Verificar o resultado
  const containerPedido = page.getByRole('paragraph')
    .filter({ hasText: /^Pedido$/ })
    .locator('..') //Sobe para o elemento pai (a div que agrupa ambos)
  await expect(containerPedido).toContainText('VLO-G7OU8O')

  const statusPedido = page.getByText(/^(APROVADO|REPROVADO|EM_ANALISE)$/) //Selo do status, qualquer que seja o valor
  await expect(statusPedido).toHaveText('APROVADO')
});