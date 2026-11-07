import { test } from '../support/fixtures'
import { CheckoutFieldError, CustomerData } from '../support/actions/checkoutActions'

const STORE = 'Velô Paulista - Av. Paulista, 1000'

const validCustomer: CustomerData = {
    name: 'Maria',
    surname: 'Silva',
    email: 'maria.silva@example.com',
    phone: '11999998888',
    cpf: '52998224725',
}

test.describe('Checkout - Validação de campos obrigatórios e dados inválidos', () => {

    // Pré-condição: o cliente configurou o carro (padrão) e está no Checkout (/order)
    test.beforeEach(async ({ app }) => {
        await app.configurator.open()
        await app.configurator.goToCheckout()
        await app.checkout.validatePage()
    })

    test('CT04.1 - Formulário em branco exibe erro em todos os campos', async ({ app }) => {
        const expectedErrors: CheckoutFieldError[] = [
            'Nome deve ter pelo menos 2 caracteres',
            'Sobrenome deve ter pelo menos 2 caracteres',
            'Email inválido',
            'Telefone inválido',
            'CPF inválido',
            'Selecione uma loja',
            'Aceite os termos',
        ]

        await app.checkout.submit()

        for (const message of expectedErrors) {
            await app.checkout.validateFieldError(message)
        }
        await app.checkout.validatePage()
    })

    test('CT04.2 - Nome e Sobrenome com 1 caractere são rejeitados', async ({ app }) => {
        await app.checkout.fillCustomer({ ...validCustomer, name: 'A', surname: 'B' })
        await app.checkout.selectStore(STORE)
        await app.checkout.acceptTerms()

        await app.checkout.submit()

        await app.checkout.validateFieldError('Nome deve ter pelo menos 2 caracteres')
        await app.checkout.validateFieldError('Sobrenome deve ter pelo menos 2 caracteres')
        await app.checkout.validatePage()
    })

    test('CT04.3 - E-mail sem formato válido é rejeitado', async ({ app }) => {
        // "cliente@.com" é barrado pela validação nativa do navegador (type="email") antes
        // do zod rodar; por isso o teste usa "cliente@dominio", que só o zod rejeita.
        await app.checkout.fillCustomer({ ...validCustomer, email: 'cliente@dominio' })
        await app.checkout.selectStore(STORE)
        await app.checkout.acceptTerms()

        await app.checkout.submit()

        await app.checkout.validateFieldError('Email inválido')
        await app.checkout.validatePage()
    })

    test('CT04.3b - E-mail "cliente@.com" exibe a mensagem "Email inválido"', async ({ app }) => {
        // DEFEITO CONHECIDO: o input type="email" bloqueia o submit nativamente e a
        // mensagem do sistema nunca é exibida para este valor. Remover test.fail()
        // quando o comportamento esperado em CT04 passo 3 for implementado.
        test.fail(true, 'Validação nativa do navegador impede a exibição de "Email inválido"')

        await app.checkout.fillCustomer({ ...validCustomer, email: 'cliente@.com' })
        await app.checkout.selectStore(STORE)
        await app.checkout.acceptTerms()

        await app.checkout.submit()

        await app.checkout.validateFieldError('Email inválido')
    })

    test('CT04.4 - CPF incompleto exibe "CPF inválido"', async ({ app }) => {
        // DEFEITO CONHECIDO: a máscara devolve "123.456.___-__" (14 caracteres) e o
        // schema só valida min(14), então o CPF incompleto é aceito. Remover test.fail()
        // quando o CPF passar a ser validado corretamente.
        test.fail(true, 'CPF incompleto com máscara é aceito pelo schema (min 14 caracteres)')

        await app.checkout.fillCustomer({ ...validCustomer, cpf: '123456' })
        await app.checkout.selectStore(STORE)
        await app.checkout.acceptTerms()

        await app.checkout.submit()

        await app.checkout.validateFieldError('CPF inválido')
    })

    test('CT04.5 - Sem aceitar os Termos o pedido não é enviado', async ({ app }) => {
        await app.checkout.fillCustomer(validCustomer)
        await app.checkout.selectStore(STORE)

        await app.checkout.submit()

        await app.checkout.validateFieldError('Aceite os termos')
        await app.checkout.validateNoFieldError('Nome deve ter pelo menos 2 caracteres')
        await app.checkout.validateNoFieldError('Sobrenome deve ter pelo menos 2 caracteres')
        await app.checkout.validateNoFieldError('Email inválido')
        await app.checkout.validateNoFieldError('Telefone inválido')
        await app.checkout.validateNoFieldError('CPF inválido')
        await app.checkout.validateNoFieldError('Selecione uma loja')
        await app.checkout.validatePage()
    })
})
