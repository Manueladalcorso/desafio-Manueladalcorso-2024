// recintos-zoo.js
import { Animal } from './animal.js';
import { Recinto } from './recinto.js';

class RecintosZoo {
    constructor() {
        this.recintos = [
            new Recinto(1, "savana", 10),
            new Recinto(2, "floresta", 5),
            new Recinto(3, "savana e rio", 7),
            new Recinto(4, "rio", 8),
            new Recinto(5, "savana", 9),
        ];

        this.recintos[0].adicionarAnimal("MACACO", 3);
        this.recintos[2].adicionarAnimal("GAZELA", 1);
        this.recintos[4].adicionarAnimal("LEAO", 1);

        this.animaisPermitidos = {
            "LEAO": new Animal("LEAO", 3, ["savana"], true),
            "LEOPARDO": new Animal("LEOPARDO", 2, ["savana"], true),
            "CROCODILO": new Animal("CROCODILO", 3, ["rio"], true),
            "MACACO": new Animal("MACACO", 1, ["savana", "floresta"], false),
            "GAZELA": new Animal("GAZELA", 2, ["savana"], false),
            "HIPOPOTAMO": new Animal("HIPOPOTAMO", 4, ["savana", "rio"], false),
        };
    }

    analisaRecintos(animal, quantidade) {
        if (!this.animaisPermitidos[animal]) {
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        const animalDados = this.animaisPermitidos[animal];
        const tamanhoAnimal = animalDados.tamanho;
        const biomasPermitidos = animalDados.bioma;
        const animalCarnivoro = animalDados.carnivoro;

        const recintosViaveis = this.recintos.filter(recinto => {
            const biomaCompativel = biomasPermitidos.includes(recinto.bioma) ||
                (animal === "HIPOPOTAMO" && recinto.bioma === "savana e rio") ||
                (animal === "MACACO" && recinto.bioma === "savana e rio");

            if (!biomaCompativel) return false;

            const espacoOcupado = recinto.animais.reduce((espacoTotal, animalNoRecinto) => {
                const tamanhoAnimalNoRecinto = this.animaisPermitidos[animalNoRecinto.especie].tamanho;
                return espacoTotal + animalNoRecinto.quantidade * tamanhoAnimalNoRecinto;
            }, 0);

            const especieDiferentePresente = recinto.animais.some(a => a.especie !== animal);
            const espacoNecessario = quantidade * tamanhoAnimal + 
                (recinto.animais.length > 0 && especieDiferentePresente ? 1 : 0);
            const espacoDisponivel = recinto.tamanho - espacoOcupado;

            const conviventesValidos = !animalCarnivoro || recinto.animais.every(animalNoRecinto => 
                this.animaisPermitidos[animalNoRecinto.especie].carnivoro && animalNoRecinto.especie === animal
            );

            const macacosComCompanhia = animal === "MACACO" ? 
                (recinto.animais.length > 0 || quantidade > 1) : true;

            const carnivorosDiferentes = recinto.animais.some(a => {
                const animalInfo = this.animaisPermitidos[a.especie];
                return animalInfo.carnivoro && a.especie !== animal;
            });

            return espacoDisponivel >= espacoNecessario && conviventesValidos && macacosComCompanhia && !carnivorosDiferentes;
        }).map(recinto => {
            const espacoOcupado = recinto.animais.reduce((espacoTotal, animalNoRecinto) => {
                const tamanhoAnimalNoRecinto = this.animaisPermitidos[animalNoRecinto.especie].tamanho;
                return espacoTotal + animalNoRecinto.quantidade * tamanhoAnimalNoRecinto;
            }, 0);

            const especieDiferentePresente = recinto.animais.some(a => a.especie !== animal);
            const espacoNecessario = quantidade * tamanhoAnimal + 
                (recinto.animais.length > 0 && especieDiferentePresente ? 1 : 0);

            const espacoLivre = recinto.tamanho - (espacoOcupado + espacoNecessario);

            return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`;
        });

        recintosViaveis.sort((a, b) => {
            const numeroA = parseInt(a.match(/\d+/)[0]);
            const numeroB = parseInt(b.match(/\d+/)[0]);
            return numeroA - numeroB;
        });

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return { recintosViaveis };
    }
}

export { RecintosZoo };
