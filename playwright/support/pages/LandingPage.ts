import { Page, expect } from '@playwright/test'

export class LandingPage {

    constructor(private page: Page) { }

    async goto() {
        await this.page.goto('/')
        const title = this.page.getByTestId('hero-section').getByRole('heading')
        await expect(title).toContainText('Velô Sprint')
    }

    async validateTitle() {
        await expect(this.page).toHaveTitle(/Velô by Papito/)
    }
}
