import { Page, expect } from '@playwright/test'
import { precoRegex } from '../helpers'

export type ExteriorColorName = 'Glacier Blue' | 'Midnight Black' | 'Lunar White'
export type WheelName = 'Aero Wheels' | 'Sport Wheels'
export type OptionalName = 'Precision Park' | 'Flux Capacitor'

export function createConfiguratorActions(page: Page) {
    const priceElement = page.getByTestId('total-price')

    return {
        async open() {
            await page.goto('/configure', { waitUntil: 'domcontentloaded' })
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
        },

        async validateCarImage(description: RegExp) {
            await expect(page.getByRole('img', { name: description })).toBeVisible()
        },

        async validatePrice(amount: string) {
            await expect(priceElement).toHaveText(precoRegex(amount))
        },
    }
}
