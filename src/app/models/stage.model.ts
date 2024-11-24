import { Monster } from "./monster.model";
import { MonsterDTO } from "./monsterDTO.model";

export class Stage {
    id: number;
    name: string;
    pokemons: MonsterDTO[];

    constructor(id: number, name: string, pokemons: MonsterDTO[] = []) {
        this.id = id;
        this.name = name;
        this.pokemons = pokemons;
    }
}