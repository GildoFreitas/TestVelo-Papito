# Casos de Teste - Landing Page

**Sistema:** Velô Sprint - Configurador e Loja Online de Veículo Elétrico
**Módulo:** Landing Page (`/`), páginas institucionais e rotas inexistentes
**Perfil:** Visitante/Cliente (anônimo). O sistema não possui login; todos os casos se aplicam ao mesmo perfil.

---

### CT01 - Navegar a partir da Landing Page

#### Objetivo
Validar que todos os links e botões da Landing Page levam às rotas corretas.

#### Pré-Condições
- Aplicação disponível na URL do ambiente de testes.
- Navegador em resolução desktop (largura >= 1024px).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acessar `/`. | A Landing Page é exibida com header, seção principal, especificações, chamada "A partir de R$ 40.000", FAQ e rodapé. |
| 2  | Clicar em "Configure o Seu" no header. | O sistema navega para `/configure`. |
| 3  | Voltar para `/` e clicar em "Configure Agora" na seção principal. | O sistema navega para `/configure`. |
| 4  | Voltar para `/` e clicar em "Monte o Seu Agora" na seção "Pronto para o Futuro?". | O sistema navega para `/configure`. |
| 5  | Voltar para `/` e clicar em "Consultar Pedido" no header. | O sistema navega para `/lookup`. |
| 6  | Clicar no logo Velô do header. | O sistema volta para `/`. |
| 7  | Clicar em "Termos de Uso" no rodapé. | O sistema navega para `/termos` e exibe o título "Termos de Uso". |
| 8  | Voltar para `/` e clicar em "Política de Privacidade" no rodapé. | O sistema navega para `/privacidade` e exibe o título "Política de Privacidade". |

#### Resultados Esperados
- Todos os pontos de navegação da Landing Page levam às páginas corretas.

#### Critérios de Aceitação
- Os 3 botões de chamada levam a `/configure`.
- "Consultar Pedido" leva a `/lookup`, e o logo leva a `/`.
- Os links legais do rodapé abrem as páginas institucionais.

---

### CT02 - Navegar pelo menu mobile

#### Objetivo
Validar que, em telas pequenas, a navegação fica disponível pelo menu recolhível.

#### Pré-Condições
- Aplicação disponível na URL do ambiente de testes.
- Navegador com largura menor que 768px (ex.: 375x812).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acessar `/`. | O header exibe apenas o logo e o ícone de menu; os links ficam ocultos. |
| 2  | Tocar no ícone de menu. | O menu se expande com "Consultar Pedido" e "Configure o Seu", e o ícone muda para "X". |
| 3  | Tocar em "Consultar Pedido". | O sistema navega para `/lookup` e o menu é fechado. |
| 4  | Voltar para `/`, abrir o menu e tocar em "Configure o Seu". | O sistema navega para `/configure`. |

#### Resultados Esperados
- A navegação mobile oferece as mesmas rotas da navegação desktop.

#### Critérios de Aceitação
- O menu abre e fecha pelo ícone e se fecha ao escolher uma opção.

---

### CT03 - Acessar uma rota inexistente

#### Objetivo
Validar o comportamento do sistema quando o usuário acessa uma URL que não existe.

#### Pré-Condições
- Aplicação disponível na URL do ambiente de testes.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acessar `/rota-inexistente`. | É exibida a página com "404", "Oops! Page not found" e o link "Return to Home". |
| 2  | Clicar em "Return to Home". | O sistema navega para `/`. |

#### Resultados Esperados
- Rotas inexistentes mostram a página 404, que permite voltar à página inicial.

#### Critérios de Aceitação
- Nenhuma tela em branco ou erro técnico é exibido.
