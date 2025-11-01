const mensagem = "Prova JS";
let codMaius = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
let codMin = "abcdefghijklmnopqrstuvwxyz"

// ===== CIFRA DE ATBASH =====
function cifrarAtbash(mensagem) {
    let cifra = ""
    for (let i = 0; i < mensagem.length; i++) {
        let letra = mensagem[i]
        let letraNova = ' '
        if (letra != " ") {
            let posicao = codMaius.search(letra)
            if (posicao != -1) {
                letraNova = codMaius[26 - posicao - 1]
            } else {
                posicao = codMin.search(letra)
                letraNova = codMin[26 - posicao - 1]
            }
        }
        cifra = cifra + letraNova
    } 
    return cifra
}

// ===== CIFRA DE CÉSAR =====
function cifrarCesar(mensagem,chave){
    let cifra = ""
    for (let i = 0; i < mensagem.length; i++){
        let letra = mensagem[i]
        let letraNova = ' '
        if (letra != " " ){
            let posicao = codMaius.search(letra)
            if (posicao != -1){
                let novoIndice = (posicao + chave) % 26
                letraNova = codMaius[novoIndice]
            }
            else{
                posicao = codMin.search(letra)
                if (posicao != -1){
                    novoIndice = (posicao + chave) % 26
                    letraNova = codMin[novoIndice]
                }
                else{
                    letraNova = letra
                }
            }
        }
        cifra = cifra + letraNova
    }
    return cifra
}

const vigenereChave = "CHAVE";
const rsaP = 17; 
const rsaQ = 19;  

// ===== VIGENÈRE =====
function cifrarVigenere(mensagem, palavraChave, modo = 'codificar') {
  if (!palavraChave || !palavraChave.length) return mensagem;
  const chave = palavraChave.replace(/[^A-Za-z]/g, '').toUpperCase();
  if (!chave.length) return mensagem;
  const resultado = [];
  let j = 0;
  const sinal = modo === 'decodificar' ? -1 : 1;
  for (let i = 0; i < mensagem.length; i++) {
    const ch = mensagem[i];
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      const m = code - 65;
      const k = chave.charCodeAt(j % chave.length) - 65;
      const novo = (m + sinal * k + 26) % 26;
      resultado.push(String.fromCharCode(65 + novo));
      j++;
    }
    else if (code >= 97 && code <= 122) {
      const m = code - 97;
      const k = chave.charCodeAt(j % chave.length) - 65;
      const novo = (m + sinal * k + 26) % 26;
      resultado.push(String.fromCharCode(97 + novo));
      j++;
    }
    else {
      resultado.push(ch);
    }
  }
  return resultado.join('');
}

// ===== RSA =====
function modPow(base, exp, mod) {
  if (mod === 1) return 0;
  let r = 1 % mod;
  let b = base % mod;
  let e = Math.floor(exp);
  while (e > 0) {
    if (e & 1) r = (r * b) % mod;
    b = (b * b) % mod;
    e = Math.floor(e / 2);
  }
  return r;
}

function gerarChavesRSA(p, q) {
  const N = p * q;
  const phi = (p - 1) * (q - 1);
  let E = 3;
  while (E < phi) {
    if ((phi % E !== 0) && ((p - 1) % E !== 0) && ((q - 1) % E !== 0)) break;
    E++;
  }
  let D = 1;
  while (D < phi) {
    if ((D * E) % phi === 1) break;
    D++;
  }
  return { publica: { E, N }, privada: { D, N } };
}

function cifrarRSA(mensagem, E, N) {
  const out = [];
  for (let i = 0; i < mensagem.length; i++) {
    const x = mensagem.charCodeAt(i); 
    out.push(modPow(x, E, N));
  }
  return out;
}

function decifrarRSA(mensagemCifrada, D, N) {
  const chars = [];
  for (let i = 0; i < mensagemCifrada.length; i++) {
    const x = modPow(mensagemCifrada[i], D, N);
    chars.push(String.fromCharCode(x));
  }
  return chars.join('');
}

// ===== TESTE =====
console.log("\nCifra de César");
const deslocamento = 3;
const cifradaCesar = cifrarCesar(mensagem, deslocamento);
const decifradaCesar = cifrarCesar(cifradaCesar, -deslocamento);
console.log("Mensagem original :", mensagem);
console.log("Cifrada (+3)      :", cifradaCesar);
console.log("Decifrada (-3)    :", decifradaCesar);
if (decifradaCesar === mensagem) {
  console.log("César passou no teste!");
} else {
  console.log("César falhou no teste!");
}

console.log("\nCifra de Atbash");
const cifradaAtbash = cifrarAtbash(mensagem);
const decifradaAtbash = cifrarAtbash(cifradaAtbash);
console.log("Mensagem original :", mensagem);
console.log("Cifrada (Atbash)  :", cifradaAtbash);
console.log("Decifrada         :", decifradaAtbash);
if (decifradaAtbash === mensagem) {
  console.log("Atbash passou no teste!");
} else {
  console.log("Atbash falhou no teste!");
}


console.log("===== Vigenère =====");
console.log("Mensagem:", mensagem);
console.log("Chave:", vigenereChave);
const vigenereCifrada = cifrarVigenere(mensagem, vigenereChave, 'codificar');
const vigenereDecifrada = cifrarVigenere(vigenereCifrada, vigenereChave, 'decodificar');
console.log("Cifrada :", vigenereCifrada);
console.log("Decifrada:", vigenereDecifrada);

console.log("\n===== RSA =====");
const CHAVES = gerarChavesRSA(rsaP, rsaQ);
console.log("Chave Pública (E,N):", CHAVES.publica);
console.log("Chave Privada (D,N):", CHAVES.privada);
const rsaCifrado = cifrarRSA(mensagem, CHAVES.publica.E, CHAVES.publica.N);
const rsaDecifrado = decifrarRSA(rsaCifrado, CHAVES.privada.D, CHAVES.privada.N);
console.log("Cifrado (números):", rsaCifrado);
console.log("Decifrado         :", rsaDecifrado);
console.log("\n===== FIM DOS TESTES =====");
