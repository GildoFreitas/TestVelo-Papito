import { Page, expect } from '@playwright/test'

export type ExteriorColorName = 'Glacier Blue' | 'Midnight Black' | 'Lunar White'
export type WheelName = 'Aero Wheels' | 'Sport Wheels'
export type OptionalName = 'Precision Park' | 'Flux Capacitor'

export function createConfiguratorActions(page: Page) {
    const priceElement = page.getByTestId('total-price')

    return {
        async open() {
            await page.addInitScript(() => localStorage.clear())
            await page.goto('/configure')
            await expect(page.getByRole('heading', { level: 1, name: 'Velô Sprint' })).toBeVisible()
        },

        async selectColor(name: ExteriorColorName) {
            await page.getByRole('button', { name }).click()
        },

        async selectWheels(name: WheelName) {
            await page.getByRole('button', { name }).click()
        },

        async toggleOptional(name: OptionalName) {
            await page.getByRole('checkbox', { name }).click()
        },

        async goToCheckout() {
            await page.getByRole('button', { name: 'Monte o Seu' }).click()
            await expect(page).toHaveURL('/order')
            await expect(page.getByRole('heading', { level: 1, name: 'Finalizar Pedido' })).toBeVisible()
        },

        async validateCarImage(description: RegExp) {
            await expect(page.getByRole('img', { name: description })).toBeVisible()
        },

        async validatePrice(amount: string) {
            const escaped = amount.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            await expect(priceElement).toHaveText(new RegExp(`R\\$\\s*${escaped}`))
        },
    }
}
