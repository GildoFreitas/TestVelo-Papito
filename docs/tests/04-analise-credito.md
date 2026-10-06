# Casos de Teste - Análise de Crédito Automática

**Sistema:** Velô Sprint - Configurador e Loja Online de Veículo Elétrico
**Módulo:** Análise de Crédito Automática (no envio do Checkout com "Financiamento")
**Perfil:** Visitante/Cliente (anônimo). O sistema não possui login; todos os casos se aplicam ao mesmo perfil.

**Regras de decisão (avaliadas nesta ordem)**
1. Entrada >= 50% do total E score < 700: APROVADO.
2. Score > 700: APROVADO.
3. Score entre 501 e 700: EM_ANALISE.
4. Score <= 500: REPROVADO.

**Pré-condição comum a todos os casos deste documento**
- A Edge Function `credit-analysis` aponta (variável `API_CREDIT_ANALYSIS_URL`) para um serviço de crédito simulado, que permite definir o score retornado.
- Configuração padrão no Configurador (R$ 40.000,00).
- Usuário está em `/order` com os dados válidos de referência do Checkout preenchidos, os termos aceitos e "Financiamento" selecionado.
- O status de cada pedido criado é verificado em `/lookup` pelo número exibido na confirmação.

---

### CT12 - Classificar o pedido financiado pelo score

#### Objetivo
Validar o status do pedido em cada faixa de score, usando os valores limite e sem entrada.

#### Pré-Condições
- Pré-condição comum deste documento.
- Campo "Valor da Entrada" vazio.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Definir o score 701 e clicar em "Confirmar Pedido". | O pedido é criado com status APROVADO. |
| 2  | Repetir com o score 700. | O pedido é criado com status EM_ANALISE. |
| 3  | Repetir com o score 501. | O pedido é criado com status EM_ANALISE. |
| 4  | Repetir com o score 500. | O pedido é criado com status REPROVADO. |

#### Resultados Esperados
- Score acima de 700 aprova o pedido, de 501 a 700 deixa em análise e até 500 reprova.

#### Critérios de Aceitação
- Os 4 valores limite resultam exatamente nos status indicados.

---

### CT13 - Aprovar pelo valor da entrada

#### Objetivo
Validar a exceção que aprova o pedido quando a entrada é de pelo menos 50% do total e o score é menor que 700.

#### Pré-Condições
- Pré-condição comum deste documento.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Definir o score 300, informar a entrada de 20000 (50%) e confirmar o pedido. | O pedido é criado com status APROVADO, e a confirmação exibe R$ 40.400,00 e "(12x de R$ 1.700,00)". |
| 2  | Repetir com a entrada de 19999 (abaixo de 50%). | O pedido é criado com status REPROVADO, pois quem decide passa a ser o score. |
| 3  | Definir o score 700 e informar a entrada de 20000 (50%). | O pedido é criado com status EM_ANALISE. |

#### Resultados Esperados
- Entrada de 50% ou mais aprova o pedido só quando o score é menor que 700.

#### Critérios de Aceitação
- O limite de 50% é inclusivo.
- Observação: com score 700 a exceção não vale e o pedido fica EM_ANALISE, embora com score 699 ele fosse aprovado. A área de negócio deve confirmar se esse comportamento é o desejado.

---

### CT14 - Falha no serviço de análise de crédito

#### Objetivo
Validar que nenhum pedido financiado é criado quando a análise de crédito falha, e que pedidos à vista não dependem do serviço.

#### Pré-Condições
- Pré-condição comum deste documento.
- Serviço de crédito configurado para responder com erro (ex.: HTTP 500).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Clicar em "Confirmar Pedido". | É exibida a notificação "Falha ao consultar análise de crédito. Verifique seus dados ou tente mais tarde." |
| 2  | Observar a página. | O usuário continua em `/order`, os dados continuam preenchidos e o botão "Confirmar Pedido" volta a ficar habilitado. |
| 3  | Configurar o serviço para responder com sucesso, mas sem o campo score, e confirmar novamente. | A mesma notificação de erro é exibida e nenhum pedido é criado. |
| 4  | Com o serviço ainda com falha, selecionar "À Vista" e confirmar. | O pedido é criado com status APROVADO. |

#### Resultados Esperados
- Falhas na análise bloqueiam só pedidos financiados, sem perder os dados do formulário.

#### Critérios de Aceitação
- Nenhum pedido financiado é gravado sem um score válido.
- O pagamento à vista funciona mesmo com o serviço de crédito indisponível.
