const express = require("express") ;
const socket = require("socket") ;
const http = require("http") ;
const {Chess} = require("chess.js") ;

const app = express() ; 

const server = http.createServer(app) ;

const io = socket(server) ; 

const chess = new Chess() ; 


