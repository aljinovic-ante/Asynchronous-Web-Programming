// 5. Napišite funkciju koja će pamtiti s kojim parametrima se pozvala i koliko puta.
// a. Na svaki poziv funkcije zapamtite vrijednost i uvećajte brojač
// b. Savjet: Koristite nizove za pamtit vrijednosti
// Napomena: 0 se može preskočiti. (Koristiti closure)
console.log("\nPETI");

function funkcija(){
    let niz=[];
    let brojac=0;
    return function unutra(b){
        brojac++;
        niz.push(b);
        console.log(b);
        console.log("niz", niz);
        console.log("brojac", brojac);
    }
}
const a=funkcija();
a(1);
a(2);
a(3);
a(555);