// 2. Napišite funkciju koja za primljeni niz stringova i odabrani znak lomi string u nizove.
// Niz: [“pr, vi”, “drugi”, “tre, ci”]
// Znak: “,”
// Rezultat: [[“pr”, “vi”], [“drugi], [“tre”, “ci”]]
console.log("\nDRUGI");

function funkcija2(niz){
    for (let element in niz) {
        niz[element]=niz[element].split(',');
    }
    return niz;
}

let niz2=["pr, vi", "drugi", "tre, ci"];
console.log(funkcija2(niz2));

