import { Page, expect } from '@playwright/test'

export function createCheckoutActions(page: Page) {
    const summaryTotal = page.getByTestId('summary-total-price')

    return {
        async validateSummaryTotal(amount: string) {
            const escaped = amount.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            await expect(summaryTotal).toHaveText(new RegExp(`R\\$\\s*${escaped}`))
        },

        async validateSummaryLine(label: string, value: string) {
            await expect(page.getByRole('listitem').filter({ hasText: label })).toContainText(value)
        },

        async validateOptionalAbsent(name: string) {
            await expect(page.getByRole('listitem').filter({ hasText: name })).toHaveCount(0)
        },
    }
}
