# Casos de Teste - Configurador de Veículo

**Sistema:** Velô Sprint - Configurador e Loja Online de Veículo Elétrico
**Módulo:** Configurador (`/configure`)
**Perfil:** Visitante/Cliente (anônimo). O sistema não possui login; todos os casos se aplicam ao mesmo perfil.

**Tabela de preços de referência**

| Item | Valor |
|------|-------|
| Preço base | R$ 40.000,00 |
| Rodas Aero | Incluso |
| Rodas Sport | + R$ 2.000,00 |
| Precision Park | + R$ 5.500,00 |
| Flux Capacitor | + R$ 5.000,00 |

---

### CT04 - Exibir a configuração padrão

#### Objetivo
Validar que o Configurador abre com a configuração padrão e o preço base.

#### Pré-Condições
- Navegador em janela anônima, ou com o armazenamento local (localStorage) limpo.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acessar `/configure`. | O Configurador é exibido com a imagem do carro e o painel "Configure seu Velô Sprint". |
| 2  | Observar as seleções do painel. | Cor Glacier Blue selecionada, Aero Wheels selecionada (Incluso) e os opcionais Precision Park e Flux Capacitor desmarcados. |
| 3  | Observar a imagem e o preço. | A imagem mostra o carro Glacier Blue com rodas Aero, e o "Preço de Venda" é R$ 40.000,00. |

#### Resultados Esperados
- A configuração inicial é Glacier Blue, rodas Aero, sem opcionais, por R$ 40.000,00.

#### Critérios de Aceitação
- O preço inicial é exatamente o preço base.

---

### CT05 - Calcular o preço conforme as escolhas

#### Objetivo
Validar que o preço e a imagem são atualizados a cada escolha de cor, rodas e opcionais, somando e removendo os acréscimos corretamente.

#### Pré-Condições
- Configurador aberto com a configuração padrão (CT04).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Selecionar a cor "Midnight Black". | A imagem passa a mostrar o carro preto; o preço continua R$ 40.000,00. |
| 2  | Selecionar "Sport Wheels". | A imagem passa a mostrar rodas Sport; o preço passa para R$ 42.000,00. |
| 3  | Marcar "Precision Park". | O preço passa para R$ 47.500,00. |
| 4  | Marcar "Flux Capacitor". | O preço passa para R$ 52.500,00 (configuração máxima). |
| 5  | Desmarcar "Precision Park". | O preço passa para R$ 47.000,00. |
| 6  | Selecionar "Aero Wheels". | O preço passa para R$ 45.000,00. |

#### Resultados Esperados
- O preço é sempre o preço base mais a soma dos itens selecionados no momento.

#### Critérios de Aceitação
- A cor não altera o preço.
- Cada item soma o valor da tabela de referência ao ser selecionado e o subtrai ao ser removido.
- Só uma cor e um tipo de roda ficam selecionados por vez.

---

### CT06 - Manter a configuração e levá-la ao Checkout

#### Objetivo
Validar que a configuração é salva no navegador e chega ao Checkout sem alterações.

#### Pré-Condições
- Configurador aberto com a configuração padrão (CT04).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Selecionar "Lunar White", "Sport Wheels" e marcar "Precision Park". | O preço exibido é R$ 47.500,00. |
| 2  | Recarregar a página (F5). | As mesmas escolhas e o mesmo preço continuam selecionados. |
| 3  | Clicar em "Monte o Seu". | O sistema navega para `/order` ("Finalizar Pedido"). |
| 4  | Observar o card "Resumo". | Exibe a imagem Lunar White com rodas Sport, Cor "Lunar White", Rodas "Sport Wheels", "Precision Park + R$ 5.500,00" e Total R$ 47.500,00. |
| 5  | Clicar na seta de voltar ao lado de "Finalizar Pedido". | O sistema volta para `/configure` com a mesma configuração. |

#### Resultados Esperados
- A configuração é mantida entre recarregamentos e aparece fielmente no Checkout.

#### Critérios de Aceitação
- O total do resumo (à vista) é igual ao "Preço de Venda" do Configurador.
- Só os opcionais marcados aparecem no resumo.
