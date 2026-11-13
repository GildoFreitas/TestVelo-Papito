import { test as base } from '@playwright/test'
import { createCheckoutActions } from './actions/checkoutActions'
import { createConfirmationActions } from './actions/confirmationActions'
import { createConfiguratorActions } from './actions/configuratorActions'
import { createOrderLookupActions } from './actions/orderLookupActions'

type App = {
    checkout: ReturnType<typeof createCheckoutActions>
    confirmation: ReturnType<typeof createConfirmationActions>
    configurator: ReturnType<typeof createConfiguratorActions>
    orderLookup: ReturnType<typeof createOrderLookupActions>
}

export const test = base.extend<{ app: App }>({
    app: async ({ page }, use) => {
        const app: App = {
            checkout: createCheckoutActions(page),
            confirmation: createConfirmationActions(page),
            configurator: createConfiguratorActions(page),
            orderLookup: createOrderLookupActions(page),
        }
        await use(app)
    },
})

export { expect } from '@playwright/test'
