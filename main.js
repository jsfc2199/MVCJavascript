//barrras, pizarron y pelota son los objetos

//funcion anínima
(function () {
    //constructor de la clase board
    self.Board = function (width, height) {
        this.width = width;
        this.height = height;

        this.playing = false;
        this.gameOver = false;

        //elementos
        this.bars = [];
        this.ball = null;
    }

    //prototipo de la clase board para los metodos
    self.Board.prototype = {
        get elements() {
            var elements = this.bars;
            elements.push(this.ball); //agrega la pelota al juego
            return elements; //retorna las barras y la pelota
        }
    }
})();


//dibujar las barras
(function () {
    //constructor de las barras
    self.Bar = function (x, y, width, height, board) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;

        //llenamos el arreglo de barras que esta en la clase board, agregando los elementos con push
        this.board.bars.push(this);

        this.kind = "rectangle"; //tipo de la figura de las barras para que el canvas sepa dibujarlo
    }

    //prototipo de la clase Bar
    self.Bar.prototype = {
        //movimiento de las barras
        down: function () {

        },
        up: function () {

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

    //prototipo del BoardView (vista)
    self.BoardView.prototype = {
        draw: function () {
            //elements es el getter del Board que devuelve las barras y la pelota
            for (var i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i];
                draw(this.context, el);
            }
        }
    }

    //---------------helper methods
    //dibujará los elementos
    function draw(context, element) {
        if(element !== null && element.hasOwnProperty("kind")){
            switch (element.kind) {
                case "rectangle":
                    context.fillRect(element.x, element.y, element.width, element.height);
                    break;
            }
        }
            
        
    }
})();

self.addEventListener("load", main);

//ejecuta todos los elementos
function main() {
    var board = new Board(800, 400);
    var bar = new Bar(20, 100, 40, 100, board);
    var bar = new Bar(700, 100, 40, 100, board);
    var canvas = document.getElementById('canvas');
    var boardView = new BoardView(canvas, board);
    boardView.draw();
}