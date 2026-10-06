# Casos de Teste - Checkout/Pedido

**Sistema:** Velô Sprint - Configurador e Loja Online de Veículo Elétrico
**Módulo:** Checkout/Pedido (`/order`)
**Perfil:** Visitante/Cliente (anônimo). O sistema não possui login; todos os casos se aplicam ao mesmo perfil.

**Dados válidos de referência**

| Campo | Valor |
|-------|-------|
| Nome | Maria |
| Sobrenome | Silva |
| Email | maria.silva@teste.com |
| Telefone | (11) 98765-4321 |
| CPF | 123.456.789-09 |
| Loja para Retirada | Velô Paulista - Av. Paulista, 1000 |

**Fórmulas do financiamento (como implementadas)**
- Valor a financiar = Total - Entrada
- Parcela = (Valor a financiar / 12) x 1,02
- Total financiado = Parcela x 12
- Valor final do pedido = Entrada + Total financiado

---

### CT07 - Finalizar pedido à vista com dados válidos

#### Objetivo
Validar a criação de um pedido à vista, que é aprovado sem análise de crédito.

#### Pré-Condições
- Configuração no Configurador: Midnight Black, Sport Wheels e Flux Capacitor (R$ 47.000,00).
- Usuário está em `/order`.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Digitar "11987654321" no Telefone e "12345678909" no CPF. | Os campos são formatados como "(11) 98765-4321" e "123.456.789-09". |
| 2  | Preencher os demais dados válidos de referência e selecionar a loja. | A loja aparece selecionada; a lista oferece 4 lojas (Paulista, Faria Lima, Morumbi e Ibirapuera). |
| 3  | Manter "À Vista" (opção padrão) e marcar o aceite dos termos. | O card "À Vista" e o Total do resumo exibem R$ 47.000,00. |
| 4  | Clicar em "Confirmar Pedido" e, em seguida, clicar de novo. | O botão mostra "Processando..." e fica desabilitado, ignorando o segundo clique. |
| 5  | Aguardar o processamento. | O sistema navega para `/success` com "Pedido Aprovado!" e um único número de pedido. |

#### Resultados Esperados
- O pedido é criado com status APROVADO e valor de R$ 47.000,00.

#### Critérios de Aceitação
- Pedido à vista é aprovado sem consultar o crédito.
- Clicar várias vezes não cria pedidos duplicados.

---

### CT08 - Enviar o formulário sem os campos obrigatórios

#### Objetivo
Validar que nenhum pedido é criado sem os campos obrigatórios e que cada campo mostra sua mensagem de erro.

#### Pré-Condições
- Usuário está em `/order` com o formulário vazio.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Clicar em "Confirmar Pedido" sem preencher nada. | O pedido não é enviado e são exibidas: "Nome deve ter pelo menos 2 caracteres", "Sobrenome deve ter pelo menos 2 caracteres", "Email inválido", "Telefone inválido", "CPF inválido", "Selecione uma loja" e "Aceite os termos". Os campos com erro ficam com borda vermelha. |
| 2  | Preencher o Nome com "Maria". | A mensagem de erro do Nome desaparece; as demais continuam. |
| 3  | Preencher os demais campos com os dados válidos de referência e aceitar os termos. | Todas as mensagens de erro desaparecem. |
| 4  | Clicar em "Confirmar Pedido". | O pedido é enviado e o sistema navega para `/success`. |

#### Resultados Esperados
- O pedido só é criado quando todos os campos obrigatórios estão preenchidos.

#### Critérios de Aceitação
- As 7 mensagens aparecem juntas no primeiro envio.
- A mensagem de cada campo some assim que ele é editado.

---

### CT09 - Enviar o formulário com dados inválidos

#### Objetivo
Validar as regras de formato e tamanho dos dados pessoais, usando os valores limite.

#### Pré-Condições
- Usuário está em `/order` com os dados válidos de referência preenchidos e os termos aceitos.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Alterar o Nome para "M" e o Sobrenome para "S" e clicar em "Confirmar Pedido". | O envio é bloqueado com "Nome deve ter pelo menos 2 caracteres" e "Sobrenome deve ter pelo menos 2 caracteres". |
| 2  | Corrigir para "Ma" e "Si" (limite de 2 caracteres). | As mensagens desaparecem. |
| 3  | Alterar o Email para "maria@" e clicar em "Confirmar Pedido". | O envio é bloqueado com o aviso de email inválido do navegador. |
| 4  | Corrigir o Email e alterar o Telefone para apenas "1198". Clicar em "Confirmar Pedido". | O envio é bloqueado com "Telefone inválido". |
| 5  | Corrigir o Telefone e alterar o CPF para apenas "123456". Clicar em "Confirmar Pedido". | O envio é bloqueado com "CPF inválido". |
| 6  | Tentar digitar letras no Telefone e no CPF. | As letras não são aceitas. |
| 7  | Corrigir o CPF e clicar em "Confirmar Pedido". | O pedido é enviado e o sistema navega para `/success`. |

#### Resultados Esperados
- Nenhum pedido é criado com dados fora do formato; com 2 caracteres em Nome e Sobrenome o pedido é aceito.

#### Critérios de Aceitação
- Nome e Sobrenome exigem pelo menos 2 caracteres.
- Email precisa estar em formato válido.
- Telefone e CPF precisam estar completos nas máscaras (99) 99999-9999 e 999.999.999-99.

---

### CT10 - Simular o financiamento

#### Objetivo
Validar os valores da simulação de financiamento, com e sem entrada.

#### Pré-Condições
- Configuração padrão (R$ 40.000,00).
- Usuário está em `/order`.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Clicar em "Financiamento". | Aparece o campo "Valor da Entrada" (com "Máximo: R$ 40.000,00") e a simulação: Valor a financiar R$ 40.000,00, Parcela (12x) R$ 3.400,00, Taxa 2% a.m., Total financiado R$ 40.800,00 e Juros totais R$ 800,00. |
| 2  | Digitar 10000 em "Valor da Entrada". | A simulação passa para: Valor a financiar R$ 30.000,00, Parcela R$ 2.550,00, Total financiado R$ 30.600,00 e Juros totais R$ 600,00. O card "Financiamento" exibe "12x de R$ 2.550,00". |
| 3  | Observar o Total do resumo. | Exibe R$ 30.600,00, ou seja, o Total financiado sem somar a entrada. |
| 4  | Clicar em "À Vista". | O campo de entrada e a simulação desaparecem, e o Total volta para R$ 40.000,00. |

#### Resultados Esperados
- A simulação é recalculada a cada alteração da entrada, conforme as fórmulas de referência.

#### Critérios de Aceitação
- Os valores exibidos batem com as fórmulas de referência.
- Observação: o acréscimo é de 2% simples sobre o valor financiado, e não juros compostos de 2% ao mês. A área de negócio deve confirmar se a regra está correta.

---

### CT11 - Informar entrada fora do limite permitido

#### Objetivo
Validar que a entrada precisa estar entre 0 e o valor total do veículo.

#### Pré-Condições
- Configuração padrão (R$ 40.000,00).
- Usuário está em `/order` com "Financiamento" selecionado, os dados válidos de referência preenchidos e os termos aceitos.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Digitar 40001 em "Valor da Entrada" e clicar em "Confirmar Pedido". | O envio é bloqueado com o aviso do navegador de que o valor deve ser menor ou igual a 40000. |
| 2  | Digitar -1 e clicar em "Confirmar Pedido". | O envio é bloqueado com o aviso do navegador de que o valor deve ser maior ou igual a 0. |

#### Resultados Esperados
- Nenhum pedido é criado com entrada negativa ou maior que o preço do veículo.

#### Critérios de Aceitação
- Só são aceitas entradas entre R$ 0,00 e R$ 40.000,00.
