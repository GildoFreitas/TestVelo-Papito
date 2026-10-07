import { test } from '../support/fixtures'

test.describe('Configurador', () => {

    test.beforeEach(async ({ app }) => {
        await app.configurator.open()
    })

    test('CT02 - Trocar a cor não altera o preço', async ({ app }) => {
        await app.configurator.validateCarImage(/glacier-blue with aero wheels/)
        await app.configurator.validatePrice('40.000,00')

        await app.configurator.selectColor('Midnight Black')

        await app.configurator.validateCarImage(/midnight-black with aero wheels/)
        await app.configurator.validatePrice('40.000,00')
    })

    test('CT02 - Rodas Sport somam R$ 2.000,00 e Aero remove o acréscimo', async ({ app }) => {
        await app.configurator.validatePrice('40.000,00')

        await app.configurator.selectWheels('Sport Wheels')

        await app.configurator.validateCarImage(/glacier-blue with sport wheels/)
        await app.configurator.validatePrice('42.000,00')

        await app.configurator.selectWheels('Aero Wheels')

        await app.configurator.validateCarImage(/glacier-blue with aero wheels/)
        await app.configurator.validatePrice('40.000,00')
    })

    test('CT03 - Adicionar opcionais e levar a configuração ao Checkout', async ({ app }) => {
        await app.configurator.toggleOptional('Precision Park')
        await app.configurator.validatePrice('45.500,00')

        await app.configurator.toggleOptional('Flux Capacitor')
        await app.configurator.validatePrice('50.500,00')

        await app.configurator.toggleOptional('Precision Park')
        await app.configurator.toggleOptional('Flux Capacitor')
        await app.configurator.validatePrice('40.000,00')

        await app.configurator.goToCheckout()

        await app.checkout.validateSummaryLine('Cor', 'Glacier Blue')
        await app.checkout.validateSummaryLine('Rodas', 'aero Wheels')
        await app.checkout.validateSummaryTotal('40.000,00')
        await app.checkout.validateOptionalAbsent('Precision Park')
        await app.checkout.validateOptionalAbsent('Flux Capacitor')
    })
})
