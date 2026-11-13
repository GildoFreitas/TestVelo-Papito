import { Page, expect } from '@playwright/test'
import { precoRegex } from '../helpers'

export function createConfirmationActions(page: Page) {
    const orderNumber = page.getByTestId('order-id')

    async function validatePage() {
        await expect(page).toHaveURL('/success')
    }

    return {
        validatePage,

        async validateOrderApproved() {
            await validatePage()
            await expect(page.getByRole('heading', { level: 1, name: 'Pedido Aprovado!' })).toBeVisible()
        },

        // O número do pedido é gerado pelo app (VLO-XXXXXX); retorna o valor para uso posterior
        async validateOrderNumber(): Promise<string> {
            await expect(orderNumber).toHaveText(/^VLO-[A-Z0-9]{6}$/)
            return (await orderNumber.textContent()) ?? ''
        },

        async validateCustomer(fullName: string, email: string, store: string) {
            await expect(page.getByText(fullName, { exact: true })).toBeVisible()
            await expect(page.getByText(email, { exact: true })).toBeVisible()
            await expect(page.getByText(store, { exact: true })).toBeVisible()
        },

        async validateSummary(color: string, amount: string) {
            await expect(page.getByRole('img', { name: 'Velô Sprint' })).toBeVisible()
            await expect(page.getByRole('heading', { level: 3, name: 'Velô Sprint' })).toBeVisible()
            await expect(page.getByText(new RegExp(`^${color} •`))).toBeVisible()
            await expect(page.getByText(precoRegex(amount))).toBeVisible()
        },
    }
}
