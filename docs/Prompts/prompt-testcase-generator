Você é um Analista de Qualidade Sênior experiente em testes funcionais de software.

Sua tarefa é criar um documento completo de Casos de Testes para o sistema descrito abaixo, seguindo rigorosamente as instruções e o modelo fornecidos.

---

## Informações do Sistema

**Nome do sistema:** Velô Sprint - Configurador e Loja Online de Veículo Elétrico

**Descrição:** Aplicação web SPA (React + Vite + TypeScript, com backend Supabase) para o veículo elétrico Velô Sprint. O cliente conhece o carro numa landing page, configura cor, rodas e opcionais com preço atualizado em tempo real, e finaliza o pedido informando dados pessoais, loja de retirada e forma de pagamento (à vista ou financiamento em 12x com entrada opcional). Pedidos financiados passam por análise de crédito automática, feita por uma Edge Function que consulta uma API externa de score pelo CPF. O pedido é gravado no banco com um número único (formato VLO-XXXXXX) e pode ser consultado depois por esse número.

**Módulos/Funcionalidades a cobrir:**
- Landing Page (`/`): header com links "Consultar Pedido" e "Configure o Seu", menu mobile, hero, especificações, CTA "A partir de R$ 40.000", FAQ em acordeão e rodapé.
- Configurador (`/configure`): cor externa (Glacier Blue, Midnight Black, Lunar White), rodas (Aero, Sport), opcionais (Precision Park, Flux Capacitor), imagem do carro atualizada conforme cor e roda, preço total e botão "Monte o Seu".
- Checkout/Pedido (`/order`): formulário de dados pessoais, loja de retirada, forma de pagamento, valor de entrada, simulação do financiamento, aceite de termos e resumo do pedido.
- Análise de Crédito Automática (apenas para financiamento).
- Confirmação (`/success`): status do pedido, resumo, número do pedido e botões "Consultar Pedido" e "Configurar Outro".
- Consulta de Pedidos (`/lookup`): busca pelo número do pedido e exibição dos detalhes.
- Páginas institucionais: Termos de Uso (`/termos`), Política de Privacidade (`/privacidade`) e página 404 para rotas inexistentes.

**Perfis de usuário:** Visitante/Cliente (anônimo). O sistema não tem login nem área administrativa: qualquer pessoa pode configurar, comprar e consultar pedidos.

**Regras de negócio relevantes:**
- Configuração padrão: Glacier Blue, rodas Aero, sem opcionais. A configuração fica salva no navegador (localStorage) e volta ao padrão depois que um pedido é concluído.
- Precificação: preço base de R$ 40.000,00; rodas Sport +R$ 2.000,00 (Aero sem custo); Precision Park +R$ 5.500,00; Flux Capacitor +R$ 5.000,00. Configuração máxima: R$ 52.500,00. Valores exibidos no formato BRL (pt-BR).
- Campos obrigatórios do checkout: Nome (mín. 2 caracteres), Sobrenome (mín. 2), Email (formato válido), Telefone (máscara (99) 99999-9999), CPF (máscara 999.999.999-99), Loja de retirada (uma de 4: Paulista, Faria Lima, Morumbi, Ibirapuera) e aceite dos Termos de Uso e da Política de Privacidade. Cada campo inválido mostra sua mensagem de erro e o pedido não é enviado.
- Pagamento à vista: o valor é o preço da configuração, não há análise de crédito e o pedido é sempre APROVADO.
- Financiamento: sempre 12 parcelas, com campo opcional de entrada (de 0 até o valor total). Valor a financiar = Total - Entrada; Parcela = (Valor a financiar / 12) x 1,02; Total financiado = Parcela x 12; Juros totais = Total financiado - Valor a financiar. O valor final do pedido é Entrada + Total financiado. Taxa exibida: "2% a.m.".
- Análise de crédito (só no financiamento), avaliada nesta ordem:
  1. Entrada >= 50% do total E score < 700: APROVADO.
  2. Score > 700: APROVADO.
  3. Score entre 501 e 700: EM_ANALISE.
  4. Score <= 500: REPROVADO.
- Falha na análise de crédito (erro de rede, API indisponível ou resposta sem score): aparece o aviso "Falha ao consultar análise de crédito. Verifique seus dados ou tente mais tarde." e o pedido não é criado.
- Confirmação: status APROVADO mostra "Pedido Aprovado!"; os demais status mostram "Crédito Reprovado". Acessar `/success` direto, sem um pedido, redireciona para a landing page.
- Número do pedido: gerado no formato `VLO-` + 6 caracteres alfanuméricos maiúsculos.
- Consulta de pedidos: exige o número do pedido; o botão "Buscar Pedido" fica desabilitado com o campo vazio. A busca ignora espaços nas pontas e diferença entre maiúsculas e minúsculas. Número inexistente mostra "Pedido não encontrado". Pedido encontrado mostra status (APROVADO, EM_ANALISE ou REPROVADO), configuração, dados do cliente, data e forma de pagamento com valor total.

---

## Escopo dos Testes

Cobrir obrigatoriamente:
- Testes funcionais (blackbox)
- Cenários positivos (fluxo feliz)
- Cenários negativos (erros, dados inválidos, permissões negadas)
- Validação de campos obrigatórios
- Validação de regras de negócio
- Fluxos principais e alternativos
- Permissões e níveis de acesso por perfil de usuário

Não incluir:
- Testes de performance
- Testes de carga ou estresse
- Testes automatizados
- Testes de segurança avançados

---

## Modelo de Caso de Teste

Cada caso de teste deve seguir exatamente este formato:

---

### CT[NN] - [Nome descritivo do caso de teste]

#### Objetivo
[Descrição clara e objetiva do que está sendo validado.]

#### Pré-Condições
- [Condição 1]
- [Condição 2]
- [...]

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | [Ação do usuário] | [Comportamento esperado do sistema] |
| 2  | [...] | [...] |

#### Resultados Esperados
- [Descreva o estado final esperado do sistema após todos os passos.]

#### Critérios de Aceitação
- [Critério objetivo 1]
- [Critério objetivo 2]
- [...]

---

## Instruções de Geração

1. Numere os casos de teste sequencialmente: CT01, CT02, CT03...
2. Cubra no mínimo os seguintes fluxos base para cada módulo informado:
   - Operação bem-sucedida (fluxo feliz)
   - Operação com dados inválidos ou incompletos
   - Operação sem permissão adequada (quando aplicável)
3. Inclua casos de teste para validação de campos obrigatórios.
4. Inclua casos de teste para cada perfil de usuário listado, sempre que houver comportamentos distintos.
5. Seja detalhado nos passos — cada ação deve ser clara o suficiente para que qualquer pessoa execute o teste sem dúvidas.
6. Gere o resultado em formato Markdown, pronto para ser salvo em um arquivo `.md` dentro da pasta `docs/tests` do projeto.