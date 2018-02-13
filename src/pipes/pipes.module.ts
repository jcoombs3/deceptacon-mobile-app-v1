import { NgModule } from '@angular/core';
import { PlayedGames } from './played-games';
import { UniqueRoles } from './unique-roles';
import { ModeratedGames } from './moderated-games';
import { SortVillagers } from './sort-villagers';
import { SortGames } from './sort-games';
import { SortCircles } from './sort-circles';

@NgModule({
  declarations: [
    PlayedGames,
    UniqueRoles,
    ModeratedGames,
    SortVillagers,
    SortGames,
    SortCircles
  ],
  imports: [

  ],
  exports: [
    PlayedGames,
    UniqueRoles,
    ModeratedGames,
    SortVillagers,
    SortGames,
    SortCircles
  ]
})
export class PipesModule { }