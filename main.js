//barrras, pizarron y pelota son los objetos

//funcion anínima
(function () {
    //constructor de la clase board
    self.Board = function (width,height) {
        this.width = width;
        this.height=height;

        this.playing = false;
        this.gameOver = false;

        //elementos
        this.bars=[];
        this.ball = null;
    }

    //prototipo de la clase board para los metodos
    self.Board.prototype={
        get elements(){
            var elements = this.bars;
            elements.push(ball); //agrega la pelota al juego
            return elements; //retorna las barras y la pelota
        }
    }
})();


//clase para dibujar
(function () {
    //constructor de la vista
    self.BoardView = function (canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;//la vista dependerá de lo que le pasemos al constructor del board
        this.canvas.height = board.height;
        this.board = board;
        this.context = canvas.getContext("2d"); //objeto a traves del cual podemos dibujar en javascript
    }
})();

self.addEventListener("load",main);

//ejecuta todos los elementos
function main() {
    var board = new Board(800,400);
    var canvas = document.getElementById('canvas');
    var boardView = new BoardView(canvas,board);
}