const socket = io() ;

socket.emit("hello")

socket.on("welcome" , function(){
    console.log("welcome") ; 
})