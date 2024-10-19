const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173'
    }
});

let playerScores = [];

io.on('connection', (socket) => {

    socket.on('score', (score) => {
        playerScores.push({ ...score, id: socket.id });

        socket.emit('playerScores', playerScores);
    });

    socket.on('editScore', (res) => {
        console.log(res)

        let currentIndex = playerScores.findIndex((data) => data.id === res.id);

        if (currentIndex !== -1) {
            playerScores[currentIndex] = { ...playerScores[currentIndex], ...res };
        }
    });

    socket.on('deleteScore', (id) => {
        let currentIndex = playerScores.findIndex((data) => data.id === id);

        if (currentIndex !== -1) {
            playerScores.splice(currentIndex, 1);
        }
    })

    setInterval(() => {
        socket.emit('playerScores', playerScores);
    }, 5000);
});



httpServer.listen(3000, () => {
    console.log("Server is listening on port 3000");
});