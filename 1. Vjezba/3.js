// 3. Napišite funkcije koje će ovisno o prvom parametru izvršavati osnovne aritmetičke operacije za
// dva broja i pri svakom pozivu logirati koja se operacija izvršava. (Koristiti closure)
console.log("\nTRECI");

function funkcija3(znak){
    switch(znak){
        case '+': return function zbroj(broj1,broj2) { return broj1+broj2;};
        case '-': return function odu(broj1,broj2) { return broj1-broj2;};
        case '*': return function mno(broj1,broj2) { return broj1*broj2;};
        case '/': return function dje(broj1,broj2) { return broj1/broj2;};
    }
}
const zb=funkcija3('+');
const ne=funkcija3('-');
const mn=funkcija3('*');
const dj=funkcija3('/');
console.log("aaa", zb(1,2));
console.log("aaa", ne(1,2));
console.log("aaa", mn(1,2));
console.log("aaa", dj(1,2));