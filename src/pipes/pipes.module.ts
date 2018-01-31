import { NgModule } from '@angular/core';
import { PlayedGames } from './played-games';
import { UniqueRoles } from './unique-roles';
import { ModeratedGames } from './moderated-games';

@NgModule({
  declarations: [
    PlayedGames,
    UniqueRoles,
    ModeratedGames
  ],
  imports: [

  ],
  exports: [
    PlayedGames,
    UniqueRoles,
    ModeratedGames
  ]
})
export class PipesModule { }