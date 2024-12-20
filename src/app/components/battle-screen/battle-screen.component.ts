import { Component, Input, OnInit, Output, EventEmitter, Renderer2, OnDestroy } from '@angular/core';
import { Monster } from '../../models/monster/monster.model';
import { MonsterComponent } from '../monster/monster.component';
import { ActionType, calculateBg } from '../../utils/game.utils';
import { DialogueComponent } from "../dialogue/dialogue.component";
import { Game } from '../../models/game/game.model';
import { DisplayStageComponent } from "../display-stage/display-stage.component";
import { ShopComponent } from '../shop/shop.component';
import { LearnMovesComponent } from "../learn-moves/learn-moves.component";
import { InputsComponent } from "../inputs/inputs.component";

@Component({
  selector: 'app-battle-screen',
  standalone: true,
  imports: [MonsterComponent, DialogueComponent, DisplayStageComponent, ShopComponent, LearnMovesComponent, InputsComponent],
  templateUrl: './battle-screen.component.html',
  styleUrl: './battle-screen.component.scss'
})
export class BattleScreenComponent {
  calculateBg = calculateBg;

  @Input() game!: Game;


  @Output() changeEnemyMonster = new EventEmitter<any>();
  @Output() playerLost = new EventEmitter<number>();

  xs: boolean = false;
  sm: boolean = false;
  md: boolean = false;
  lg: boolean = false;
  xl: boolean = false;
  xxl: boolean = false;

  ngDoCheck() {
    this.game.checkTurn();
    if (this.game.playerLost === true) {
      this.playerLost.emit(this.game.playerScore);
    }
    else if (this.game.enemyMonster.hp <= 0 && this.game.dialogues.length === 0 && !this.game.playerMonster.canEvolve) {
      this.changeEnemyMonster.emit();
      this.game.enemyLost = false;
    }
    this.xs = window.innerWidth < 640
    this.sm = window.innerWidth >= 640 && window.innerWidth < 768
    this.md = window.innerWidth >= 768 && window.innerWidth < 1024
    this.lg = window.innerWidth >= 1024 && window.innerWidth < 1280
    this.xl = window.innerWidth >= 1280 && window.innerWidth < 1536
    this.xxl = window.innerWidth >= 1536
  }

  

}
