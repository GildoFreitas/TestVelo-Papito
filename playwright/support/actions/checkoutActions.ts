import { Page, expect } from '@playwright/test'
import { escapeRegex, precoRegex } from '../helpers'

export type CustomerData = {
    name: string
    surname: string
    email: string
    phone: string
    cpf: string
}

export type CheckoutFieldError =
    | 'Nome deve ter pelo menos 2 caracteres'
    | 'Sobrenome deve ter pelo menos 2 caracteres'
    | 'Email inválido'
    | 'Telefone inválido'
    | 'CPF inválido'
    | 'Selecione uma loja'
    | 'Aceite os termos'

export function createCheckoutActions(page: Page) {
    const summaryTotal = page.getByTestId('summary-total-price')

    const elements = {
        // exact: true evita que "Nome" case também com "Sobrenome"
        name: page.getByRole('textbox', { name: 'Nome', exact: true }),
        surname: page.getByRole('textbox', { name: 'Sobrenome', exact: true }),
        email: page.getByRole('textbox', { name: 'Email', exact: true }),
        phone: page.getByRole('textbox', { name: 'Telefone', exact: true }),
        cpf: page.getByRole('textbox', { name: 'CPF', exact: true }),
        store: page.getByRole('combobox', { name: 'Loja para Retirada' }),
        terms: page.getByRole('checkbox', { name: /Li e aceito os/ }),
        submitButton: page.getByRole('button', { name: 'Confirmar Pedido' }),
    }

    // Localizador por texto, independente da tag e de classes (só quebra se a mensagem mudar):
    // - RegExp é case-sensitive, então "Nome deve..." não casa com "Sobrenome deve...".
    // - O placeholder "Selecione uma loja" tem o mesmo texto do erro; ele vive dentro do
    //   combobox, então excluímos qualquer elemento descendente de role="combobox".
    const outsideCombobox = page.locator(':not([role="combobox"] *)')
    const fieldError = (message: CheckoutFieldError) =>
        page.getByText(new RegExp(escapeRegex(message))).and(outsideCombobox)

    async function validatePage() {
        await expect(page).toHaveURL('/order')
        await expect(page.getByRole('heading', { level: 1, name: 'Finalizar Pedido' })).toBeVisible()
    }

    return {
        elements,
        validatePage,

        async fillCustomer(data: Partial<CustomerData>) {
            if (data.name !== undefined) await elements.name.fill(data.name)
            if (data.surname !== undefined) await elements.surname.fill(data.surname)
            if (data.email !== undefined) await elements.email.fill(data.email)
            if (data.phone !== undefined) await elements.phone.fill(data.phone)
            if (data.cpf !== undefined) await elements.cpf.fill(data.cpf)
        },

        async selectStore(name: string) {
            await elements.store.click()
            await page.getByRole('option', { name }).click()
            await expect(elements.store).toContainText(name)
        },

        async acceptTerms() {
            await elements.terms.check()
        },

        async submit() {
            await elements.submitButton.click()
        },

        async validateFieldError(message: CheckoutFieldError) {
            await expect(fieldError(message)).toBeVisible()
        },

        async validateNoFieldError(message: CheckoutFieldError) {
            await expect(fieldError(message)).toHaveCount(0)
        },

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
