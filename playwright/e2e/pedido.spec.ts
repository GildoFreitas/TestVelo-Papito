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
  await expect(page.locator('//p[text()="Pedido"]/..//p[text()="VLO-G7OU8O"]')).toBeVisible();
  await expect(page.locator('//p[text()="Pedido"]/../../..//*[text()="APROVADO"]')).toBeVisible();
});