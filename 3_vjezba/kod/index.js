// Ovdje ce te pisat funkcije koje vam trebaju. Ako zelite, mozete razdvojit u par datoteka, ali iz ove datoteke vam mora
// biti exportana glavna funkcija 
const fs=require('fs').promises;
const path=require('path')
// const dirPath = 'C:/Faks/AWP/2024_aljinovic-ante/3_vjezba/tekstualneDatoteke';
const dirPath = path.join(__dirname, '..', 'tekstualneDatoteke');


async function readFiles (files) {
	let data=[];
	let string='';
	for(const file of files){
		try{
			const fileData=await fs.readFile(file,'utf8')
			//console.log('File content: ', fileData);
			let words=fileData.split(" ");
			let numOfWords=words.length;
			//console.log("Broj rijeci: ",numOfWords)
			let imeDat=file.split("/")[2];
			//console.log("Ime dat: ",imeDat);
			let numOfWordsWithSameLength={};
			words=words.map(word=>word.replace(/[^a-zA-ZčćđžČĆĐŽŠš]/g, '')).filter(word=>word.length>0)
			words.forEach(word=>{
				string+=word;
				let length=word.length;
				console.log(word);
				if(length!==0){
					if(numOfWordsWithSameLength[length]===undefined){
						numOfWordsWithSameLength[length]=0;
					}
					numOfWordsWithSameLength[length]+=1;
				}
			})
			data.push({
				"imeDatoteke":imeDat,
				"ukupanBrojRiječi":numOfWords,
				"brojRijeciSaIstimBrojemSlova":numOfWordsWithSameLength
			})
			console.log(data);
		
		}catch(err){
			console.error("error: ",err);
		}
	}
	try{
		string=string.replace(/ /g,"");
		await fs.writeFile(path.join(dirPath,'newFile.txt'),string,'utf8');
	}
	catch(err){
			console.error(err);
	}
	
}

async function getFiles() {
	try{
		const files=await fs.readdir(dirPath);
		console.log(files);
		return files;
	}
	catch(err){
		console.log("error: ",err);
	}
}

// getFiles().then(files=>{
// 					files=files.map(file=>`../tekstualneDatoteke/${file}`);
// 					console.log("fileovi: ",files);
// 					readFiles(files);
// 				}
// 			)
// 		  .catch(err => console.log("error: ",err));


module.exports = {
	getFiles,
	readFiles
}