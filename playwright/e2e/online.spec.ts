import { test } from '../support/fixtures'

test('Webapp  is online', async ({ landingPage }) => {
    await landingPage.goto()
    await landingPage.validateTitle()
})
