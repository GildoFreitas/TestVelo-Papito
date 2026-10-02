import { Page } from '@playwright/test'

export class Navbar {

    constructor(private page: Page) { }

    async clickConsultarPedido() {
        await this.page.getByTestId('header-nav').getByRole('link', { name: 'Consultar Pedido' }).click()
    }
}