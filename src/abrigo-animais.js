const ANIMAIS = {
  Rex: { tipo: 'cão', brinquedos: ['RATO', 'BOLA'] },
  Mimi: { tipo: 'gato', brinquedos: ['BOLA', 'LASER'] },
  Fofo: { tipo: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
  Zero: { tipo: 'gato', brinquedos: ['RATO', 'BOLA'] },
  Bola: { tipo: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },
  Bebe: { tipo: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
  Loco: { tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] }
};

class AbrigoAnimais {

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    try {
      const pessoa1 = brinquedosPessoa1.split(',').map(b => b.trim());
      const pessoa2 = brinquedosPessoa2.split(',').map(b => b.trim());
      const animaisOrdem = ordemAnimais.split(',').map(a => a.trim());

      // --- Aqui são as validações ---
      if (new Set(animaisOrdem).size !== animaisOrdem.length || 
          animaisOrdem.some(a => !ANIMAIS[a])) {
        return { erro: 'Animal inválido' };
      }

      if (new Set(pessoa1).size !== pessoa1.length || new Set(pessoa2).size !== pessoa2.length) {
        return { erro: 'Brinquedo inválido' };
      }

      // Esse é o contador de quantos animais cada pessoa já levou
      const adotados = { p1: 0, p2: 0 };
      const resultado = [];

      // Essa função que checa se brinquedos atendem ao animal
      const atende = (listaBrinquedos, animalNome) => {
        const animal = ANIMAIS[animalNome];
        if (animalNome === 'Loco') return true;

        if (animal.tipo === 'gato') {
          // o que os gatos exigem exatamente a sequência, sem dividir
          const filtrado = listaBrinquedos.filter(b => animal.brinquedos.includes(b));
          return JSON.stringify(filtrado) === JSON.stringify(animal.brinquedos);
        } else {
          // aqui os cães aceitam intercalado
          let idx = 0;
          for (const brinquedo of listaBrinquedos) {
            if (brinquedo === animal.brinquedos[idx]) idx++;
            if (idx === animal.brinquedos.length) return true;
          }
          return false;
        }
      };

      for (const animalNome of animaisOrdem) {
        const animal = ANIMAIS[animalNome];
        let dono = 'abrigo';

        const p1 = atende(pessoa1, animalNome);
        const p2 = atende(pessoa2, animalNome);

        if (p1 && !p2 && adotados.p1 < 3) {
          dono = 'pessoa 1';
          adotados.p1++;
        } else if (p2 && !p1 && adotados.p2 < 3) {
          dono = 'pessoa 2';
          adotados.p2++;
        } else {
          dono = 'abrigo';
        }

        resultado.push(`${animalNome} - ${dono}`);
      }

      // regra especial do Loco
      const locoIndex = resultado.findIndex(r => r.startsWith('Loco'));
      if (locoIndex !== -1) {
        const outrosAdotados = resultado.filter(r => !r.startsWith('Loco') && !r.endsWith('abrigo'));
        if (outrosAdotados.length === 0) {
          resultado[locoIndex] = 'Loco - abrigo';
        }
      }

      return { lista: resultado.sort() };
    } catch (err) {
      return { erro: 'Brinquedo inválido' };
    }
  } 
}

export { AbrigoAnimais as AbrigoAnimais };
