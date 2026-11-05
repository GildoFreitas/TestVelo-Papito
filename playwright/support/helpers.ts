export function precoRegex(amount: string): RegExp {
    const escaped = amount.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(`R\\$\\s*${escaped}`)
}

export function gerarCodigoPedido() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = 'VLO-';
  
    for (let i = 0; i < 6; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
  
    return codigo;
  }