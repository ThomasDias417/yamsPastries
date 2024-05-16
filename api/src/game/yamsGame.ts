export function randomNumber() {
    return Math.floor(Math.random() * 6) + 1;
}
  
    
export function resultPastriesWon(dices: Array<number>) {
      if (isThereFiveIndenticalNumbers(dices)) {
        return 3
      } else if (isThereFourIndenticalNumbers(dices)) {
        return 2
      } else if (isPairInRoll(dices)) {
        return 1
      } else {
        return 0
      }
}

  
function isPairInRoll(dices: Array<number>) {
      const occ: { [key: number]: number } = {}
      for (const dice of dices) {
          occ[dice] = (occ[dice] || 0) + 1;
      }
    
      let pairCount = 0;
      for (const value of Object.values(occ)) {
          if (value === 2) {
              return true
          }
      }
    
      return pairCount === 2;
  }
    
function isThereFourIndenticalNumbers(dices: Array<number>) {
      const identicalCount: number = dices.filter(dice => dice === dices[0]).length;
      return identicalCount === 4
}
    
function isThereFiveIndenticalNumbers(dices: Array<number>) {
      const allEqual: boolean = dices.every((dice, index) => dice === dices[0]);
      return allEqual
}