// 4. Napišite funkciju koja za primljeni niz prirodnih brojeva filtrira niz, tako da vraća dva nova niza
// parnih i neparnih brojeva. Novi nizovi su sortirani te izvorni (poslani) niz se ne smije mutirati.
console.log("\nCETVRTI");

function filter(niz){
    let parni;
    let neparni;
    parni=niz.filter(n=>n%2==0);
    neparni=niz.filter(n=>n%2!=0);
 
    return [parni,neparni];
}
let niz4=[1,2,3,4,5,6,7,8,9];
const [parni,neparni]=filter(niz4);
console.log("parni", parni);
console.log("neparni", neparni);