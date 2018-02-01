import { NgModule } from '@angular/core';
import { PlayedGames } from './played-games';
import { UniqueRoles } from './unique-roles';
import { ModeratedGames } from './moderated-games';
import { SortVillagers } from './sort-villagers';

@NgModule({
  declarations: [
    PlayedGames,
    UniqueRoles,
    ModeratedGames,
    SortVillagers
  ],
  imports: [

  ],
  exports: [
    PlayedGames,
    UniqueRoles,
    ModeratedGames,
    SortVillagers
  ]
})
export class PipesModule { }