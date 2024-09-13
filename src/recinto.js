// recinto.js
class Recinto {
    constructor(numero, bioma, tamanho) {
        this.numero = numero;
        this.bioma = bioma;
        this.tamanho = tamanho;
        this.animais = [];
    }

    adicionarAnimal(animal, quantidade) {
        this.animais.push({ especie: animal, quantidade });
    }
}

export { Recinto };
