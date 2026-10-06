import { test, expect, Page } from '@playwright/test'

async function openLanding(page: Page): Promise<void> {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: 'Velô Sprint' })).toBeVisible()
}

async function expectConfigurator(page: Page): Promise<void> {
    await expect(page).toHaveURL('/configure')
    await expect(page.getByRole('button', { name: 'Monte o Seu' })).toBeVisible()
}

test.describe('Landing Page', () => {

    test('CT01 - Navegar a partir da Landing Page', async ({ page }) => {
        const header = page.getByRole('banner')
        const footer = page.getByRole('contentinfo')

        // Passo 1 - Estado inicial com todas as seções
        await openLanding(page)
        await expect(header.getByRole('link', { name: 'Consultar Pedido' })).toBeVisible()
        await expect(header.getByRole('link', { name: 'Configure o Seu' })).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Especificações Técnicas' })).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Pronto para o Futuro?' })).toBeVisible()
        await expect(page.getByText('R$ 40.000', { exact: true })).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Perguntas Frequentes' })).toBeVisible()
        await expect(footer).toBeVisible()

        // Passo 2 - "Configure o Seu" no header
        await header.getByRole('link', { name: 'Configure o Seu' }).click()
        await expectConfigurator(page)

        // Passo 3 - "Configure Agora" na seção principal
        await openLanding(page)
        await page.getByRole('link', { name: 'Configure Agora' }).click()
        await expectConfigurator(page)

        // Passo 4 - "Monte o Seu Agora" na seção "Pronto para o Futuro?"
        await openLanding(page)
        await page.getByRole('link', { name: 'Monte o Seu Agora' }).click()
        await expectConfigurator(page)

        // Passo 5 - "Consultar Pedido" no header
        await openLanding(page)
        await header.getByRole('link', { name: 'Consultar Pedido' }).click()
        await expect(page).toHaveURL('/lookup')
        await expect(page.getByRole('heading', { name: 'Consultar Pedido' })).toBeVisible()
        await expect(page.getByLabel('Número do Pedido')).toBeVisible()

        // Passo 6 - Logo do header volta para a Landing Page
        await header.getByRole('link', { name: 'Velô', exact: true }).click()
        await expect(page).toHaveURL('/')
        await expect(page.getByRole('heading', { level: 1, name: 'Velô Sprint' })).toBeVisible()

        // Passo 7 - "Termos de Uso" no rodapé
        await footer.getByRole('link', { name: 'Termos de Uso' }).click()
        await expect(page).toHaveURL('/termos')
        await expect(page.getByRole('heading', { level: 1, name: 'Termos de Uso' })).toBeVisible()

        // Passo 8 - "Política de Privacidade" no rodapé
        await openLanding(page)
        await footer.getByRole('link', { name: 'Política de Privacidade' }).click()
        await expect(page).toHaveURL('/privacidade')
        await expect(page.getByRole('heading', { level: 1, name: 'Política de Privacidade' })).toBeVisible()
    })
})
