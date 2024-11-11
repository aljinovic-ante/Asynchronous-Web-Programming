const readline = require('readline');
const fs = require('fs').promises; 

const {
  Igra: IgraPotapanja,
  DULJINA_STRANICE_PLOCE
} = require('./igra')

let novaIgra = new IgraPotapanja()

const questionTekst =
`
Opcije:
- n          => napravi novu igru
- p          => ispisi plocu
- m x:1 y:3 => napravi potez na ovim koordinatama
- q          => zaustavi proces

Vas odabir: `

const moveRegex = new RegExp(/m\ x:\d+\ y:\d/)
/**
 * Helper to format user input
 * @param {String} input
 * @returns
 */

class BazniError extends Error{
  constructor(status,poruka,ime,stackTrace){
    super(poruka);
    this.status=status;
    this.ime=ime;
    this.stackTrace=stackTrace;
  }
}

function formatInput (input) {
  if (!input) {
    throw new BazniError(400, 'Prazan unos', 'PrazanUnosError', (new Error()).stack);
  }

  switch (input) {
    case 'n':
    case 'p':
    case 'q':
      return { input }
  }

  if (moveRegex.test(input)) {
    const splitInputs = input.split(' ')
    const formattedInput = { input: 'm' }

    for (let i = 1;i < 3; i++) {
      const [key, value] = splitInputs[i].split(':')
      formattedInput[key] = Number(value)
    }
    return formattedInput
  }
  throw new BazniError(400, 'Pogresan unos', 'PogresanUnosError', (new Error()).stack);
}

async function zapisiGresku(error) {
  const vrijeme = new Date().toUTCString();
  const logPoruka = `${vrijeme} ${error.ime}: ${error.message} STACK TRACE: ${error.stack.replace(/\n/g, ' ')}`;

  try {
    await fs.appendFile('log.txt', logPoruka + "\n");
  } catch (error) {
    console.error('Greska pri zapisu u log datoteku:', error);
    throw new BazniError(400, 'Greska kod zapisivanja errora u log', 'GreskaZapisaErrora', error.stack);
  }
}

async function inputLoop (igraObj) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.question(questionTekst, async input => {
    rl.close()

    try {
      const formattedInput = formatInput(input);
      console.log(formattedInput);
      if (formattedInput.input === 'n') {
        novaIgra = new IgraPotapanja();
        console.log('Nova igra zapoceta');
      } else if (formattedInput.input === 'm') {
        const { x, y } = formattedInput;
        novaIgra.napraviPotez({ x, y });
      } else if (formattedInput.input === 'p') {
        novaIgra.ispisPloce();
      } else if (formattedInput.input === 'q') {
        console.log('Zaustavi igru');
        process.exit(0);
      } else {
        throw new BazniError(400, "Pogresan unos - clog txt", "Pogresan Unos Error", (new Error()).stack);
      }
      
    } 
    catch (error) {
      await zapisiGresku(error);
      console.error(error);
    }

    console.log('\n')
    process.nextTick(() => inputLoop(igraObj))
  })
}

/**
 * 
 * @param {Object} igraObj 
 */
function main (igraObj) {
  inputLoop(igraObj)
}

process.nextTick(() => main(novaIgra))