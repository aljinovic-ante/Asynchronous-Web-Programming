const fs=require('fs').promises;
const path=require('path')

function treci(){
	async function readFiles (fileName) {
		try{
			const fileData=await fs.readFile(fileName,'utf8')
			// console.log(fileData)
			return fileData
		}catch(err){
			// console.error("error: ",err);
			throw err;
		}
	}


	readFiles('tekst.txt').then(string=>{
		console.log(string)
	})
	.catch(err => { 
		console.error("ERROR JE OVDE: ",err); 
		console.log("POSLI ERRORA") 
	});
}
function cetvrti(){
	async function readFiles () {
		let string='';
		try{
			const fileData=await fs.readFile('tekst.txt','utf8')
			//console.log('File content: ', fileData);
			let words=fileData.split(" ");
			for(let word of words){
				if(word.length%2==0) word="lolo";
				else word="tro"

				string+=word+' '
			}
			// console.log(string)

			return string
		
		}catch(err){
			console.error("error: ",err);
		}
	}

	readFiles().then(string=>{
		console.log(string)
	})
	.catch(err => console.log("error: ",err));
}

function drugi(){
	let someObject = require('./podaciZaDatoteke.json')
	for(datoteka of someObject.datoteke){
		let decoded = atob(datoteka);
		console.log(decoded);
	}
	for(sadrzaj of someObject.sadrzaj){
		let decoded = atob(sadrzaj);
		console.log(decoded);
	}
}

function prvi(){
	function funkcija(){
        let niz=[];
        let brojac=0;
        return function unutra(b){
            brojac++;
            if(typeof(b)==="function"){
                console.log("tip:", typeof(b))
                b()
                niz.push(b);
                return {brojac,niz};
            }
            let obj = {
                poruka:  "Krivi poziv funkcije!",
                ukupanBrojPozivaFunkcije: brojac,
            };
            return obj;
        }
	}
	const a=funkcija();
	console.log(a(2));
	console.log(a(()=>{}));
	console.log(a(2));
	console.log(a((a,b)=>{return a+b}));
	console.log(a((a,b)=>{return a*b}));
	console.log(a(2));
}
module.exports = {
	cetvrti,
	treci,
	drugi,
	prvi,
}