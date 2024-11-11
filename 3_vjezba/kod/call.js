const {getFiles,readFiles} = require('./index.js');

getFiles().then(files=>{
					files=files.map(file=>`../tekstualneDatoteke/${file}`);
					console.log("fileovi: ",files);
					readFiles(files);
				}
			)
		  .catch(err => console.log("error: ",err));

