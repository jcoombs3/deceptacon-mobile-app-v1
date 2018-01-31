import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uniqueRoles'
})
export class UniqueRoles implements PipeTransform {
  transform(games: any[], villager: any) {
    let userData = [];
    let roleObj = {};
    let roles = [];
    let allGames = 0;
    
    for (let i = 0; i < games.length; i++) {
      let game = games[i]
      if (this.checkForUserDetails(game, villager)) {
        userData.push(game.userDetails[villager._id]);
      }
    }
    allGames = userData.length;
    if (userData.length > 0) {
      const unique = Array.from(new Set(userData.map(data => data.role._id)));
      unique.forEach(id => {
        roleObj[id] = userData.filter(data => data.role._id === id)[0];
        roleObj[id].amount = userData.filter(data => data.role._id === id).length;
        roleObj[id].wins = games.filter(game => 
          game.userDetails[villager._id] &&
          game.userDetails.winner._id === game.userDetails[villager._id].alignment._id &&  
          roleObj[id].role._id === game.userDetails[villager._id].role._id
        ).length;
      });
    }
    for (let id in roleObj) {
      roles.push(roleObj[id]);
    }
    roles = roles.sort((a, b) => {
      if (a.amount < b.amount) return 1;
      else if (a.amount > b.amount) return -1;
      else return 0;
    });
    const finalObj = {
      max: allGames,
      roles: roles
    };
    return finalObj;
  }
  
  checkForUserDetails(game: any, villager: any) {
    if (game.userDetails[villager._id] && 
        game.userDetails[villager._id].role) {
      return true;
    }
    return false;
  }
}