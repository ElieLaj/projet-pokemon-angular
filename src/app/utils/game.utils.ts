import e from 'express';
import { MonsterType, StageType } from './monster.utils';
import { MonsterDTO } from '../models/monsterDTO.model';
import { Monster } from '../models/monster.model';
import { Move } from '../models/move.model';

export enum TurnType {
    Player = 'Player',
    Enemy = 'Enemy',
    Dialogue = 'Dialogue'
}

export enum ActionType {
    Attack = 'Attack',
    Item = 'Item',
    Run = 'Run',
    Swap = 'Swap'
}

export enum MoveCategory {
    Physical = 'Physical',
    Special = 'Special',
    Effect = 'Effect'
}

const typeEffectiveness: Record<string, Record<string, number>> = {
  Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire: { Grass: 2, Water: 0.5, Fire: 0.5, Rock: 0.5, Bug: 2, Steel: 2, Ice: 2, Dragon: 0.5 },
  Water: { Fire: 2, Grass: 0.5, Water: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Electric: { Water: 2, Grass: 0.5, Electric: 0.5, Flying: 2, Ground: 0, Dragon: 0.5 },
  Grass: { Water: 2, Fire: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Flying: 0.5, Bug: 0.5, Dragon: 0.5, Steel: 0.5 },
  Ice: { Grass: 2, Fire: 0.5, Water: 0.5, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Rock: 2, Steel: 2, Ice: 2, Dark: 2, Ghost: 0, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Fairy: 0.5 },
  Poison: { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
  Ground: { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Rock: 2, Bug: 0.5, Flying: 0, Steel: 2 },
  Flying: { Grass: 2, Electric: 0.5, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug: { Grass: 2, Fire: 0.5, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5, Fairy: 0.5 },
  Rock: { Fire: 2, Ice: 2, Flying: 2, Bug: 2, Fighting: 0.5, Ground: 0.5, Steel: 0.5 },
  Ghost: { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark: { Psychic: 2, Ghost: 2, Fighting: 0.5, Dark: 0.5, Fairy: 0.5 },
  Steel: { Rock: 2, Ice: 2, Fairy: 2, Fire: 0.5, Water: 0.5, Electric: 0.5, Steel: 0.5 },
  Fairy: { Fighting: 2, Dragon: 2, Dark: 2, Fire: 0.5, Poison: 0.5, Steel: 0.5 }
};

export const calculateModifier = (attackingType: string, pokemonTypes: string[], defendingTypes: string[]): number => {
  let modifier = 1;
  if (pokemonTypes.includes(attackingType)) modifier *= 1.5;

  defendingTypes.forEach(defendingType => {
    if (typeEffectiveness[attackingType] && typeEffectiveness[attackingType][defendingType] !== undefined) {
      modifier *= typeEffectiveness[attackingType][defendingType];
    }
  });

  return modifier;
};

export const calculateDamage = (
  pokemon: Monster,
  enemy: Monster,
  move: Move,
  dialogues: string[]
) => {
  const stat = move.category.name === MoveCategory.Physical ? pokemon.attack : pokemon.specialAttack;
  const enemyStat = move.category.name === MoveCategory.Physical ? enemy.defense : enemy.specialDefense;

  const modifier = calculateModifier(move.type.name, pokemon.types.map(type => type.name), enemy.types.map(type => type.name));
  
  const baseDamage = Math.floor(
    (((((pokemon.level * 0.4 + 2) * stat * move.power) / enemyStat) / 50) + 2)
  );

  const damage = Math.floor(baseDamage * modifier * (Math.random() * 0.15 + 0.85));
  enemy.hp = Math.max(enemy.hp - damage, 0);

  if (modifier === 0) dialogues.push(`${pokemon.name} used ${move.name}, but it had no effect on ${enemy.name}!`);
  else dialogues.push(`${pokemon.name} used ${move.name} on ${enemy.name} and dealt ${damage}!`);


  if (enemy.hp <= 0) {
    dialogues.push(`${enemy.name} fainted!`);
    return;
  }

  triggerEffect(enemy, move, pokemon, dialogues);

};

export const triggerEffect = (pokemon: Monster, move: Move, enemy: Monster, dialogues: string[]) => {
  if (move.moveEffects) {
    switch (move.moveEffects[0]?.effect.name.toLowerCase()) {
      case 'burnt':
        dialogues.push('The enemy was burned!');
        break;
      case 'paralyze':
        dialogues.push('The enemy was paralyzed!');
        break;
      case 'freeze':
        dialogues.push('The enemy was frozen!');
        break;
      case 'poison':
        dialogues.push('The enemy was poisoned!');
        break;
      case 'sleep':
        dialogues.push('The enemy fell asleep!');
        break;
      case 'confuse':
        dialogues.push('The enemy was confused!');
        break;
      case 'flinch':
        dialogues.push('The enemy flinched!');
        break;
      case 'leechseed':
        dialogues.push('The enemy was seeded!');
        break;
      case 'toxic':
        dialogues.push('The enemy was badly poisoned!');
        break;
      case 'trap':
        dialogues.push('The enemy was trapped!');
        break;
      case 'heal':
        pokemon.heal(move.power);
        dialogues.push(`${pokemon.name} healed ${move.power} hp!`);
        break;
      default:
        break;
    }
  }
};

export const calculateBg = (type: string = 'none'): string => {
  switch (type) {
    case MonsterType.Grass:
    case 'Forest':
    case 'Field':
      console.log('Grass');
      return '#78C850';
    case MonsterType.Fire:
    case StageType.Volcano:
      return '#F08030';
    case MonsterType.Water:
    case StageType.Sea:
      return '#6890F0';
    case MonsterType.Electric:
      return '#F8D030';
    case MonsterType.Ice:
    case StageType.IceCave:
      return '#98D8D8';
    case MonsterType.Fighting:
    case StageType.Mountain:
      return '#C03028';
    case MonsterType.Poison:
      return '#A040A0';
    case MonsterType.Ground:
    case StageType.Desert:
      return '#E0C068';
    case MonsterType.Flying:
    case StageType.Sky:
      return '#A890F0';
    case MonsterType.Psychic:
      return '#F85888';
    case MonsterType.Bug:
    case StageType.Farm:
      return '#A8B820';
    case MonsterType.Rock:
    case StageType.Mountain:
      return '#B8A038';
    case MonsterType.Ghost:
    case StageType.Graveyard:
      return '#705898';
    case MonsterType.Dragon:
    case StageType.Space:
      return '#7038F8';
    case MonsterType.Dark:
    case StageType.Graveyard:
      return '#705848';
    case MonsterType.Steel:
    case StageType.Factory:
      return '#B8B8D0';
    case MonsterType.Fairy:
      return '#EE99AC';
    case MonsterType.Normal:
    case StageType.City:
      return '#A8A878';
    default:
      return '#A8A878';
  }
};


export const transformManyPokemonDTO = (pokemons: MonsterDTO[]): Monster[] => {
  return pokemons.map((monster: MonsterDTO) => {
      return new Monster(
        monster.id,
        monster.name,
        monster.hp,
        monster.attack,
        monster.defense,
        monster.specialAttack,
        monster.specialDefense,
        monster.speed,
        monster.expRate,
        monster.pokemonMoves,
        monster.types
      );
    });
};

export const transformPokemonDTO = (pokemon: MonsterDTO): Monster => {
  return new Monster(
    pokemon.id,
    pokemon.name,
    pokemon.hp,
    pokemon.attack,
    pokemon.defense,
    pokemon.specialAttack,
    pokemon.specialDefense,
    pokemon.speed,
    pokemon.expRate,
    pokemon.pokemonMoves,
    pokemon.types
  );
};