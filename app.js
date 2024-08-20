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

    usocket.on("hello" , function()
    {
        io.emit("welcome") ;
    })
})

server.listen(3000 , function(){
    console.log("listening on local host")
}) ;
