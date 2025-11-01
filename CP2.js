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
                if (novoIndice < 0){
                  letraNova = codMaius[novoIndice + 26]
                }
                else{
                  letraNova = codMaius[novoIndice]
                }
            }
            else{
                posicao = codMin.search(letra)
                if (posicao != -1){
                    novoIndice = (posicao + chave) % 26
                    if (novoIndice < 0){
                      letraNova = codMin[novoIndice + 26]
                    }
                    else{
                      letraNova = codMin[novoIndice]
                    }
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

function gerarChavesRSA_Didaticas(p, q) {
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

function cifrarRSA_Didatico(mensagem, E, N) {
  const out = [];
  for (let i = 0; i < mensagem.length; i++) {
    const x = mensagem.charCodeAt(i); 
    out.push(modPow(x, E, N));
  }
  return out;
}

function decifrarRSA_Didatico(mensagemCifrada, D, N) {
  const chars = [];
  for (let i = 0; i < mensagemCifrada.length; i++) {
    const x = modPow(mensagemCifrada[i], D, N);
    chars.push(String.fromCharCode(x));
  }
  return chars.join('');
}

// ===== TESTE =====
// Atbash:

console.log(cifrarAtbash("OlaMundo")); 

// César:

console.log(cifrarCesar("criptografia", 3)); // Esperado: "fulswrjudild"
console.log(cifrarCesar("fulswrjudild", -3)); // Esperado: "criptografia"

// Vigenère:

const chaveV = "CHAVE";
const codificadoV = cifrarVigenere("Enigma!", chaveV, 'codificar'); 
console.log(codificadoV); // Ex: "Guibqc!!"
console.log(cifrarVigenere(codificadoV, chaveV, 'decodificar')); // Esperado: "Enigma!"

// RSA (Usar a função gerarChavesRSA_Didaticas):

const PRIMO_1 = 17;
const PRIMO_2 = 19;
const CHAVES = gerarChavesRSA_Didaticas(PRIMO_1, PRIMO_2); 

const textoOriginal = "OLA"; 

// 1. Cifrar com a Chave Pública
const cifrado = cifrarRSA_Didatico(textoOriginal, CHAVES.publica.E, CHAVES.publica.N);
console.log("RSA Cifrado:", cifrado); // Array de números

// 2. Decifrar com a Chave Privada
const decifrado = decifrarRSA_Didatico(cifrado, CHAVES.privada.D, CHAVES.privada.N);
console.log("RSA Decifrado:", decifrado); // Esperado: "OLA"
