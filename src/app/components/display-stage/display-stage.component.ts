import { Component, Input } from '@angular/core';
import { Stage } from '../../models/game/stage.model';
import { PokemonDisplayComponent } from "../pokemon-display/pokemon-display.component";
import { transformManyPokemonDTO } from '../../utils/game.utils';

@Component({
  selector: 'app-display-stage',
  standalone: true,
  imports: [PokemonDisplayComponent],
  templateUrl: './display-stage.component.html',
  styleUrl: './display-stage.component.scss'
})
export class DisplayStageComponent {
  @Input() stage!: Stage;
  transformManyPokemonDTO = transformManyPokemonDTO;

  showEncounter: boolean = false;
  constructor() { }


}
