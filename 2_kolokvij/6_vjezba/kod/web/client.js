const socket2 = io("localhost:3012");
socket2.emit("game-start", { isPlayer: true });
socket2.on("initial-data", (position) => {
    console.log("Initial position:", position);
    function makeMove(){
        const move = {
            x:Math.floor(Math.random()*20),
            y:Math.floor(Math.random()*20)
        }
        if (move) {
            socket2.emit("make-move", move);
        }
    }
    setInterval(makeMove,1000);
    socket2.on("move-response", (response) => {
        response ? console.log("move DONE:", response) : console.log("move DENIED");
    });
    socket2.on("status", ({ gameData, points }) => {
            console.log("gameData:", gameData);
            console.log("points:", points);
    });
});