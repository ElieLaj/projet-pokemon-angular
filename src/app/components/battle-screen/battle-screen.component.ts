import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Monster } from '../../models/monster/monster.model';
import { MonsterComponent } from '../monster/monster.component';
import { ActionType, calculateBg } from '../../utils/game.utils';
import { DialogueComponent } from "../dialogue/dialogue.component";
import { Game } from '../../models/game.model';
import { DisplayStageComponent } from "../display-stage/display-stage.component";
import { ShopComponent } from '../shop/shop.component';

@Component({
  selector: 'app-battle-screen',
  standalone: true,
  imports: [MonsterComponent, DialogueComponent, DisplayStageComponent, ShopComponent],
  templateUrl: './battle-screen.component.html',
  styleUrl: './battle-screen.component.scss'
})
export class BattleScreenComponent implements OnInit {
  calculateBg = calculateBg;

  @Input() game!: Game;


  @Output() changeEnemyMonster = new EventEmitter<any>();
  @Output() playerLost = new EventEmitter<number>();


  ngOnInit() {
    if (this.game.dialogues.length === 0) {
      this.game.dialogues.push('A wild monster appeared!');
    }
  }

  ngDoCheck() {
    this.game.checkTurn();
    if (this.game.playerLost === true) {
      this.playerLost.emit(this.game.playerScore);
    }
    else if (this.game.enemyMonster.hp <= 0 && this.game.dialogues.length === 0 && !this.game.playerMonster.canEvolve) {
      this.changeEnemyMonster.emit();
      this.game.enemyLost = false;
    }
  }
}
