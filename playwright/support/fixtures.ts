import { test as base } from '@playwright/test'
import { Navbar } from './components/Navbar'
import { LandingPage } from './pages/LandingPage'
import { OrderLookupPage } from './pages/OrderLookupPage'

type Pages = {
    landingPage: LandingPage
    navbar: Navbar
    orderLookupPage: OrderLookupPage
}

export const test = base.extend<Pages>({
    landingPage: async ({ page }, use) => {
        await use(new LandingPage(page))
    },
    navbar: async ({ page }, use) => {
        await use(new Navbar(page))
    },
    orderLookupPage: async ({ page }, use) => {
        await use(new OrderLookupPage(page))
    }
})

export { expect } from '@playwright/test'
