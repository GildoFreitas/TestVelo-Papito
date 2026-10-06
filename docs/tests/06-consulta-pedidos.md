# Casos de Teste - Consulta de Pedidos

**Sistema:** Velô Sprint - Configurador e Loja Online de Veículo Elétrico
**Módulo:** Consulta de Pedidos (`/lookup`)
**Perfil:** Visitante/Cliente (anônimo). O sistema não possui login; qualquer pessoa com o número do pedido consegue consultá-lo.

---

### CT17 - Consultar pedidos existentes

#### Objetivo
Validar a exibição dos dados e do status de pedidos existentes, incluindo a busca com letras minúsculas e espaços.

#### Pré-Condições
- Existem 3 pedidos criados pelo Checkout, com os números anotados:
  - APROVADO, à vista: Glacier Blue, Sport Wheels, Maria Silva, maria.silva@teste.com, R$ 42.000,00.
  - REPROVADO, financiado.
  - EM_ANALISE, financiado.
- Usuário está em `/lookup`.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Digitar o número do pedido APROVADO e clicar em "Buscar Pedido". | O botão mostra "Buscando..." e, em seguida, o card do pedido é exibido com o selo "APROVADO" em verde. |
| 2  | Observar os dados do card. | São exibidos: número do pedido, imagem Glacier Blue com rodas Sport, Modelo "Velô Sprint", Cor "Glacier Blue", Rodas "Sport Wheels", Nome "Maria Silva", Email "maria.silva@teste.com", Data do Pedido (dd/mm/aaaa), "À Vista" e R$ 42.000,00. |
| 3  | Buscar o mesmo número em letras minúsculas e com espaços antes e depois (ex.: "  vlo-abc123  "). | O mesmo pedido é encontrado. |
| 4  | Buscar o número do pedido REPROVADO. | O card é substituído, com o selo "REPROVADO" em vermelho e o pagamento "Financiamento 12x". |
| 5  | Buscar o número do pedido EM_ANALISE. | O card exibe o selo "EM_ANALISE" em âmbar. |

#### Resultados Esperados
- Os pedidos são encontrados pelo número, com os dados gravados e o status destacado pela cor.

#### Critérios de Aceitação
- A busca não diferencia maiúsculas de minúsculas e ignora espaços nas pontas.
- Cada status tem cor própria: verde, vermelho e âmbar.
- Observação: o Interior aparece como "cream" e a Loja de Retirada fica vazia, porque esses dados não são gravados no banco. A área de negócio deve avaliar.

---

### CT18 - Consultar um pedido inexistente

#### Objetivo
Validar a mensagem exibida para números que não correspondem a nenhum pedido.

#### Pré-Condições
- Usuário está em `/lookup`.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Buscar "VLO-ZZZ999" (formato válido, mas inexistente). | É exibido "Pedido não encontrado" com a mensagem "Verifique o número do pedido e tente novamente". |
| 2  | Buscar "123" (fora do formato). | É exibido "Pedido não encontrado", sem erro técnico. |
| 3  | Buscar um número existente. | A mensagem desaparece e o pedido é exibido. |

#### Resultados Esperados
- Números inexistentes ou inválidos não exibem nenhum dado de pedido.

#### Critérios de Aceitação
- A mensagem de pedido não encontrado aparece para qualquer número que não exista.

---

### CT19 - Tentar consultar sem informar o número do pedido

#### Objetivo
Validar a obrigatoriedade do número do pedido para fazer a busca.

#### Pré-Condições
- Usuário está em `/lookup`.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Observar o botão "Buscar Pedido" com o campo vazio. | O botão está desabilitado. |
| 2  | Digitar apenas espaços. | O botão continua desabilitado. |
| 3  | Digitar um caractere qualquer. | O botão fica habilitado. |

#### Resultados Esperados
- Não é possível buscar sem informar o número do pedido.

#### Critérios de Aceitação
- O botão só é habilitado quando há pelo menos um caractere diferente de espaço.
