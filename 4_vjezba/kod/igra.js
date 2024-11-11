function swap (arr, index01, index02) {
  const temp = arr[index01]
  arr[index01] = arr[index02]
  arr[index02] = temp
}
class BazniError extends Error{
  constructor(status,poruka,ime,stackTrace){
    super(poruka);
    this.status=status;
    this.ime=ime;
    this.stackTrace=stackTrace;
  }
}

class KriviPotezError extends BazniError {
  constructor(x,y) {
    super(400, `Promasaj ${x}-${y} - clog txt`, "KriviPotezError", (new Error()).stack);
  }
}

class IgraZavrsenaError extends BazniError {
  constructor() {
    super(400, "Igra je završena - clog txt", "IgraZavrsenaError", (new Error()).stack);
  }
}

const DULJINA_STRANICE_PLOCE = 5

const fs = require('fs');
function zapisiGresku(error) {
  const vrijeme = new Date().toUTCString();
  const logPoruka = `${vrijeme} ${error.ime}: ${error.message} STACK TRACE: ${error.stack.replace(/\n/g, ' ')}`;
  fs.appendFileSync('log.txt', logPoruka + "\n");
}

const Igra = function () {
  const brojMeta = 10

  let ploca = []
  generiraneTocke = {}
  pogodeneTocke = {}
  pokusaji = {}

  this.jeLiIgraZavrsena = function () {
    return Object.keys(pogodeneTocke).length === brojMeta
  }

  // this.napraviPotez = function (potez) {
  //   if (generiraneTocke[`${potez.x}-${potez.y}`]) {
  //     pogodeneTocke[`${potez.x}-${potez.y}`] = true
  //   }
  //   pokusaji[`${potez.x}-${potez.y}`] = true

  //   return !!pogodeneTocke[`${potez.x}-${potez.y}`]
  // }

  this.napraviPotez = function(potez) {
    try {
      if (this.jeLiIgraZavrsena()) {
        throw new IgraZavrsenaError();
      }
  
      if (!generiraneTocke[`${potez.x}-${potez.y}`]) {
        throw new KriviPotezError(potez.x,potez.y);
      }
  
      pogodeneTocke[`${potez.x}-${potez.y}`] = true;
      pokusaji[`${potez.x}-${potez.y}`] = true;
      return true;
  
    } catch (error) {
      zapisiGresku(error);
      console.error(error.message);
      return false;
    }
  };

  this.ispisPloce = function () {
    console.log('Ispis ploce:')
    for (let x = 0; x < DULJINA_STRANICE_PLOCE; x++) {
      let line = []
      for (let y = 0; y < DULJINA_STRANICE_PLOCE; y++) {
        let mark = '-'
        const key = `${x}-${y}`

        if (pokusaji[key]) {
          mark = 'X'
        }

        if (pogodeneTocke[key]) {
          mark = 'o'
        }

        line.push(mark)
      }
      // print ploce
      console.log(line.join(' '))
    }
  }

  function generirajTocke () {
    const moguceTocke = []
    for (let i = 0; i < DULJINA_STRANICE_PLOCE; i++) {
      for (let j = 0; j < DULJINA_STRANICE_PLOCE; j++) {
        moguceTocke.push({
          x: i,
          y: j
        })
      }
    }

    // shuffler
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        const randomA = Math.floor(Math.random() * 25) % 25
        const randomB = Math.floor(Math.random() * 25) % 25

        swap(moguceTocke, randomA, randomB)
      }
    }

    for (let i = 0; i < brojMeta; i++) {
      const mark = moguceTocke[i]
      generiraneTocke[`${mark.x}-${mark.y}`] = true
    }
  }

  ploca = new Array(DULJINA_STRANICE_PLOCE)
  for (let i = 0; i < DULJINA_STRANICE_PLOCE; i++) {
    ploca[i] = new Array(DULJINA_STRANICE_PLOCE)
  }

  generirajTocke()
}

module.exports = {
  Igra,
  DULJINA_STRANICE_PLOCE,
}