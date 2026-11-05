import { Page, expect } from '@playwright/test'
import { precoRegex } from '../helpers'

export function createCheckoutActions(page: Page) {
    const summaryTotal = page.getByTestId('summary-total-price')

    async function validatePage() {
        await expect(page).toHaveURL('/order')
        await expect(page.getByRole('heading', { level: 1, name: 'Finalizar Pedido' })).toBeVisible()
    }

    return {
        validatePage,

        async validateSummaryTotal(amount: string) {
            await validatePage()
            await expect(summaryTotal).toHaveText(precoRegex(amount))
        },

        async validateSummaryLine(label: string, value: string) {
            await validatePage()
            await expect(page.getByRole('listitem').filter({ hasText: label })).toContainText(value)
        },

        async validateOptionalAbsent(name: string) {
            await validatePage()
            await expect(page.getByRole('listitem').filter({ hasText: name })).toHaveCount(0)
        },
    }
}
