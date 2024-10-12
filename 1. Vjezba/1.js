// Asinkrono web programiranje
// Prva Vježba - osnove javascripta i funkcije
// Napraviti novi branch preko git-a koja će se zvati prva-vjezba. Sve zadatke iz prve vježbe
// treba commitati u novi branch i nakon što se svi zadaci naprave pushati na repozitorij. Pokušajte
// prilikom rješavanja uočiti koje bi vrijednosti mogle biti “const”.

// 1. Napišite funkciju koja će korištenjem niza ispisati sve moguće tipove u javascriptu. (Niz može
// imati različite vrijednosti. Koristiti petlje i typeof!)
console.log("\nPRVI");
function prva(niz){
    for (const element of niz) {
        console.log(typeof(element));
    }
}
const niz=[1,true,()=>{},2===3,'c',"string",52.3,{}];
prva(niz);