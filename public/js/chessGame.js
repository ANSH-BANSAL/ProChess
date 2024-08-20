const socket = io();
const chess = new Chess();

const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
	const board = chess.board();
	boardElement.innerHTML = "";

	board.forEach((row, rowIndex) => {
		row.forEach((square, squareIndex) => {
			const squareElement = document.createElement("div");
			squareElement.classList.add(
				"square",
				(rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
			);

			squareElement.dataset.row = rowIndex;
			squareElement.dataset.column = squareIndex;

			if (square) {
				const pieceElement = document.createElement("div");
				pieceElement.classList.add(
					"piece",
					square.color === "w" ? "white" : "black"
				);

				pieceElement.innerText = getPieceUnicode(square);
				pieceElement.draggable = playerRole === square.color;

				pieceElement.addEventListener("dragstart", (e) => {
					if (pieceElement.draggable) {
						draggedPiece = pieceElement;
						sourceSquare = { row: rowIndex, column: squareIndex };
						e.dataTransfer.setData("text/plain", "");
					}
				});

				pieceElement.addEventListener("dragend", () => {
					draggedPiece = null;
					sourceSquare = null;
				});

				squareElement.appendChild(pieceElement);
			}

			squareElement.addEventListener("dragover", (e) => {
				e.preventDefault();
			});

			squareElement.addEventListener("drop", (e) => {
				e.preventDefault();

				if (draggedPiece) {
					const targetSquare = {
						row: parseInt(squareElement.dataset.row),
						column: parseInt(squareElement.dataset.column),
					};

					handleMove(sourceSquare, targetSquare);
				}
			});

			boardElement.appendChild(squareElement);
		});
	});

	if (playerRole === "b") {
		boardElement.classList.add("flipped");
	} else {
		boardElement.classList.remove("flipped");
	}
};

const handleMove = (source, target) => {
	const move = {
		from: [String.fromCharCode(97 + source.column), 8 - source.row].join(
			""
		),
		to: [String.fromCharCode(97 + target.column), 8 - target.row].join(""),
		promotion: "q",
	};

	socket.emit("move", move);
};

const getPieceUnicode = (piece) => {
	const unicodePieces = {
		p: "♙",
		n: "♘",
		b: "♗",
		r: "♖",
		q: "♕",
		k: "♔",
		P: "♟",
		N: "♞",
		B: "♝",
		R: "♜",
		Q: "♛",
		K: "♚",
	};

	// return unicodePieces[piece.type.toUpperCase()] || "";
	return unicodePieces[piece.type] || "";
};

socket.on("playerRole", (role) => {
	playerRole = role;
	renderBoard();
});

socket.on("spectatorRole", () => {
	playerRole = null;
	renderBoard();
});

socket.on("boardState", (fen) => {
	chess.load(fen);
	renderBoard();
});

socket.on("move", (move) => {
	try {
		chess.move(move);
	} catch (error) {
		console.log("Invalid move: ", move.from, move.to);
	}
	renderBoard();
});

renderBoard() ;