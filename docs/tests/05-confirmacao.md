# Casos de Teste - Confirmação do Pedido

**Sistema:** Velô Sprint - Configurador e Loja Online de Veículo Elétrico
**Módulo:** Confirmação (`/success`)
**Perfil:** Visitante/Cliente (anônimo). O sistema não possui login; todos os casos se aplicam ao mesmo perfil.

---

### CT15 - Exibir a confirmação conforme o status do pedido

#### Objetivo
Validar a mensagem, os dados e os botões da confirmação para pedidos aprovados e não aprovados.

#### Pré-Condições
- Serviço de crédito simulado com score configurável (ver documento de Análise de Crédito).
- Configuração no Configurador: Lunar White, Sport Wheels (R$ 42.000,00).
- Checkout preenchido com Maria Silva, maria.silva@teste.com e loja "Velô Faria Lima - Av. Faria Lima, 2500".

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Concluir o pedido à vista. | É exibido "Pedido Aprovado!" em verde, com a mensagem "Seu pedido foi processado com sucesso. Em breve entraremos em contato." |
| 2  | Observar os dados da confirmação. | São exibidos: imagem Lunar White com rodas Sport, R$ 42.000,00, Número do Pedido no formato VLO-XXXXXX, Cliente "Maria Silva", Email "maria.silva@teste.com" e Loja "Velô Faria Lima - Av. Faria Lima, 2500". |
| 3  | Clicar em "Configurar Outro". | O Configurador abre com a configuração padrão (Glacier Blue, Aero, sem opcionais, R$ 40.000,00). |
| 4  | Refazer a mesma configuração e concluir um pedido financiado sem entrada, com score 800. | É exibido "Pedido Aprovado!" com R$ 42.840,00 e "(12x de R$ 3.570,00)". |
| 5  | Concluir um pedido financiado com score 400. | É exibido "Crédito Reprovado" em vermelho, com a mensagem "Infelizmente seu crédito não foi aprovado. Tente novamente com pagamento à vista." |
| 6  | Concluir um pedido financiado com score 600. | É exibido "Crédito Reprovado" (o status gravado é EM_ANALISE). |
| 7  | Clicar em "Consultar Pedido". | O sistema navega para `/lookup`. |

#### Resultados Esperados
- A confirmação mostra os dados do pedido criado, e a configuração volta ao padrão depois do pedido.

#### Critérios de Aceitação
- Só pedidos APROVADO exibem "Pedido Aprovado!".
- Pedidos financiados exibem o valor da parcela.
- Observação: pedidos EM_ANALISE aparecem como "Crédito Reprovado", que é o comportamento atual. A área de negócio deve avaliar.

---

### CT16 - Acessar a confirmação diretamente pela URL

#### Objetivo
Validar que a página de confirmação só pode ser vista logo após a criação de um pedido.

#### Pré-Condições
- Aplicação disponível na URL do ambiente de testes.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Digitar `/success` na barra de endereço e acessar. | O sistema redireciona para `/` sem exibir dados de pedido. |
| 2  | Concluir um pedido e abrir a URL `/success` em uma nova aba. | A nova aba é redirecionada para `/`. |

#### Resultados Esperados
- Nenhum dado de pedido é exibido quando a página é acessada fora do fluxo de compra.

#### Critérios de Aceitação
- O acesso direto sempre redireciona para a Landing Page.
