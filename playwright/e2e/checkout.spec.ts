import { test } from '../support/fixtures'
import { CheckoutField, CheckoutFieldError, CustomerData } from '../support/actions/checkoutActions'
import { deleteOrdersByEmail } from '../support/database/orderRepository'
import checkout from '../support/fixtures/checkout.json' with { type: 'json' }

//AAA - Arrange, Act, Assert

test.describe('Checkout - Validação de campos obrigatórios e dados inválidos', () => {

    //Test Data
    const customer = checkout.customer as CustomerData
    const store = checkout.store
    const invalid = checkout.invalid

    // Não encerramos a conexão aqui: ela é compartilhada com outros specs no mesmo worker
    // (o pedido.spec.ts já chama closeDb() no afterAll e fecharia para os demais).
    test.beforeEach(async ({ app }) => {
        //Arrange - Remove pedidos de execuções anteriores para não gerar duplicidade
        // (o app gera o número do pedido, então a chave de limpeza é o e-mail do cliente)
        await deleteOrdersByEmail(customer.email)

        //Arrange - Pré-condição: o cliente configurou o carro (padrão) e está no Checkout (/order)
        await app.configurator.open()
        await app.configurator.goToCheckout()
        await app.checkout.validatePage()
    })

    test('CT04.1 - Formulário em branco exibe erro em todos os campos', async ({ app }) => {
        //Test Data
        const expectedErrors: [CheckoutField, CheckoutFieldError][] = [
            ['name', 'Nome deve ter pelo menos 2 caracteres'],
            ['surname', 'Sobrenome deve ter pelo menos 2 caracteres'],
            ['email', 'Email inválido'],
            ['phone', 'Telefone inválido'],
            ['cpf', 'CPF inválido'],
            ['store', 'Selecione uma loja'],
            ['terms', 'Aceite os termos'],
        ]

        //Act - Executar a ação
        await app.checkout.submit()

        //Assert - Verificar o resultado
        for (const [field, message] of expectedErrors) {
            await app.checkout.validateFieldError(field, message)
        }
        await app.checkout.validatePage()
    })

    test('CT04.2 - Nome e Sobrenome com 1 caractere são rejeitados', async ({ app }) => {
        //Arrange
        await app.checkout.fillCustomer({ ...customer, name: invalid.shortName, surname: invalid.shortSurname })
        await app.checkout.selectStore(store)
        await app.checkout.acceptTerms()

        //Act
        await app.checkout.submit()

        //Assert
        await app.checkout.validateFieldError('name', 'Nome deve ter pelo menos 2 caracteres')
        await app.checkout.validateFieldError('surname', 'Sobrenome deve ter pelo menos 2 caracteres')
        await app.checkout.validatePage()
    })

    test('CT04.3 - E-mail sem formato válido é rejeitado', async ({ app }) => {
        // "cliente@.com" é barrado pela validação nativa do navegador (type="email") antes
        // do zod rodar; por isso o teste usa "cliente@dominio", que só o zod rejeita.

        //Arrange
        await app.checkout.fillCustomer({ ...customer, email: invalid.emailWithoutDomain })
        await app.checkout.selectStore(store)
        await app.checkout.acceptTerms()

        //Act
        await app.checkout.submit()

        //Assert
        await app.checkout.validateFieldError('email', 'Email inválido')
        await app.checkout.validatePage()
    })

    test('CT04.3b - E-mail "cliente@.com" exibe a mensagem "Email inválido"', async ({ app }) => {
        // DEFEITO CONHECIDO: o input type="email" bloqueia o submit nativamente e a
        // mensagem do sistema nunca é exibida para este valor. Remover test.fail()
        // quando o comportamento esperado em CT04 passo 3 for implementado.
        test.fail(true, 'Validação nativa do navegador impede a exibição de "Email inválido"')

        //Arrange
        await app.checkout.fillCustomer({ ...customer, email: invalid.emailNativeInvalid })
        await app.checkout.selectStore(store)
        await app.checkout.acceptTerms()

        //Act
        await app.checkout.submit()

        //Assert
        await app.checkout.validateFieldError('email', 'Email inválido')
    })

    test('CT04.4 - CPF incompleto exibe "CPF inválido"', async ({ app }) => {
        //Arrange
        await app.checkout.fillCustomer({ ...customer, cpf: invalid.incompleteCpf })
        await app.checkout.selectStore(store)
        await app.checkout.acceptTerms()

        //Act
        await app.checkout.submit()

        //Assert
        await app.checkout.validateFieldError('cpf', 'CPF inválido')
    })

    // CPFs completos (máscara preenchida), mas inválidos: o primeiro com dígito verificador
    // errado (o válido do fixture é 529.982.247-25) e o segundo com todos os dígitos iguais.
    const completeInvalidCpfs = [
        { label: 'dígito verificador incorreto', cpf: invalid.cpfWrongCheckDigit },
        { label: 'todos os dígitos iguais', cpf: invalid.cpfRepeatedDigits },
    ]

    for (const { label, cpf } of completeInvalidCpfs) {
        test(`CT04.5 - CPF completo com ${label} exibe "CPF inválido"`, async ({ app }) => {
            //Arrange
            await app.checkout.fillCustomer({ ...customer, cpf })
            await app.checkout.selectStore(store)
            await app.checkout.acceptTerms()

            //Act
            await app.checkout.submit()

            //Assert
            await app.checkout.validateFieldError('cpf', 'CPF inválido')
            await app.checkout.validatePage()
        })
    }

    test('CT04.6 - Sem aceitar os Termos o pedido não é enviado', async ({ app }) => {
        //Arrange - Todos os dados válidos, exceto o aceite dos termos
        await app.checkout.fillCustomer(customer)
        await app.checkout.selectStore(store)

        //Act
        await app.checkout.submit()

        //Assert
        await app.checkout.validateFieldError('terms', 'Aceite os termos')
        await app.checkout.validateNoFieldError('name')
        await app.checkout.validateNoFieldError('surname')
        await app.checkout.validateNoFieldError('email')
        await app.checkout.validateNoFieldError('phone')
        await app.checkout.validateNoFieldError('cpf')
        await app.checkout.validateNoFieldError('store')
        await app.checkout.validatePage()
    })
})
