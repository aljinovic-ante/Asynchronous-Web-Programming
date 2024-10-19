// dodati kod za igru ovdje

/**
 * Primjer callback funkcije
 */
// function cb (x, y) {
//   console.log('Primjer', 'x', x, ', y', y)
// }

// render.init(cb)

const igra = {
    board:{},
    isRed: true,
    score:{crveni:0,plavi:0},
    init: function(){
        render.init((x,y)=>this.makeMove(x, y));
        this.displayScore();
    },
    makeMove: function(x,y){
        console.log("make move");
        console.log("x je: "+x);
        console.log("y je: "+y);
        if(this.checkMove(x,y)){
            this.isRed ? this.setBoard(`${x}-${y}`,`c`) : this.setBoard(`${x}-${y}`,`p`);
            this.isRed=!this.isRed;
            render.draw(this.board);
        }
        const result=this.isEnd(this.board)
        setTimeout(()=>{
            if(result.hasWon){
                if(result.winner==='Crveni') this.score.crveni+=1;
                else this.score.plavi+=1;
                window.alert(`Igrac ${result.winner} je pobijedio, rezultat: crveni ${this.score.crveni} - ${this.score.plavi} plavi`);
                this.restart();
            }
        },0);
    },
    setBoard: function(key,value){
        this.board[key]=value;
    },
    printBoard: function(){
        console.log(this.board);
    },
    checkMove: function(x,y){
        let move=`${x}-${y}`;
        if(y>HEIGHT || x>=WIDTH || x<0 || y<0){
            console.log("ovde");
            return false;
        }
        if(move in this.board) return false;
        if(y>0){
            let base=`${x}-${y-1}`
            if(!(base in this.board)){
                window.alert("Invalid move")
                return false;
            }  
        }
        return true;
    },
    isEnd: function(board) {
        function getValue(x,y){
            return board[`${x}-${y}`] || null;
        }
        //horizontal
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH - 3; x++) {
                let player = getValue(x, y);
                if (player && getValue(x + 1, y) === player && getValue(x + 2, y) === player && getValue(x + 3, y) === player) {
                    return { hasWon: true, winner: player === 'c' ? 'Crveni' : 'Plavi' };
                }
            }
        }
        //vertical
        for (let x = 0; x < WIDTH; x++) {
            for (let y = 0; y < HEIGHT - 3; y++) {
                let player = getValue(x, y);
                if (player && getValue(x, y + 1) === player && getValue(x, y + 2) === player && getValue(x, y + 3) === player) {
                    return { hasWon: true, winner: player === 'c' ? 'Crveni' : 'Plavi' };
                }
            }
        }
        //diagonal l to r
        for (let x = 0; x < WIDTH - 3; x++) {
            for (let y = 0; y < HEIGHT - 3; y++) {
                let player = getValue(x, y);
                if (player && getValue(x + 1, y + 1) === player && getValue(x + 2, y + 2) === player && getValue(x + 3, y + 3) === player) {
                    return { hasWon: true, winner: player === 'c' ? 'Crveni' : 'Plavi' };
                }
            }
        }
        //diagonal r to l
        for (let x = 3; x < WIDTH; x++) {
            for (let y = 0; y < HEIGHT - 3; y++) {
                let player = getValue(x, y);
                if (player && getValue(x - 1, y + 1) === player && getValue(x - 2, y + 2) === player && getValue(x - 3, y + 3) === player) {
                    return { hasWon: true, winner: player === 'c' ? 'Crveni' : 'Plavi' };
                }
            }
        }
        return false;
    },
    restart: function(){
        this.board={};
        this.isRed=true;
        render.clear();
        render.init((x,y)=>this.makeMove(x,y));
        this.displayScore();
    },
    displayScore: function(){
        const rezultat=document.getElementById('rezultat');
        rezultat.textContent=`Crveni ${this.score.crveni} - ${this.score.plavi} Plavi`
    }    
}
igra.init();
igra.printBoard();
