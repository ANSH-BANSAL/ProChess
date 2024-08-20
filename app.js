const express = require("express") ;
const socket = require("socket.io") ;
const http = require("http") ;
const {Chess} = require("chess.js") ;
const path = require("path") ; 

const app = express() ; 

const server = http.createServer(app) ;

const io = socket(server) ; 

const chess = new Chess() ; 

let players = {} ; 

let currentPlayer = "W" ; 

app.set("view engine" , "ejs") ;
app.use(express.static(path.join(__dirname , "public"))) ;

app.get("/" , (req,res) => {
    res.render("index" , {title : "Welcome to ProChess"}) ;
})

io.on("connection" , function(usocket){
    console.log("connected"); 

    if(!players.white){
        players.white = usocket.id ;
        usocket.emit("playerRole" , "w") ;
    }
    else if(!players.black){
        players.black = usocket.id ;
        usocket.emit("playerRole" , "b") ;
    }
    else{
        usocket.emit("spectatorRole") ;
    }

    usocket.on("disconnect" , function(){
        if(usocket.id === players.white){
            delete players.white ;
        }
        else if(usocket.id === players.black){
            delete players.black ;
        }
    })

    usocket.on("move" , (move)=> {
        try {
            if(chess.turn === 'w' && usocket.id !== players.white) return ;
            if(chess.turn === 'b' && usocket.id !== players.black) return ;

            const result = chess.move(move) ;
            if(result){
                currentPlayer = chess.turn() ;
                io.emit("move" , move) ;
            }
        } catch (error) {
            
        }
    })
})

server.listen(3000 , function(){
    console.log("listening on local host")
}) ;
