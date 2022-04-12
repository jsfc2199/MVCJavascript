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
            var elements = this.bars.map(function (bar) { return bar; }); //pasamos el arreglo como capia en vez de referencia
            elements.push(this.ball); //agrega la pelota al juego usandose en el constructor de la pelota
            return elements; //retorna las barras y la pelota
        }
    }
})();

//para la creacion de la pelota
(function () {
    //constructor pelota
    self.Ball = function (x, y, radio, board) {
        this.x = x;
        this.y = y;
        this.radio = radio;
        this.board = board;
        this.speedY = 0;
        this.speedX = 3;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 3;

        board.ball = this;
        this.kind = "circle"


    }

    //prototipo de la pelota
    self.Ball.prototype = {
        move: function () {
            this.x += (this.speedX * this.direction); //1 a la derecha -1 a la izquierda
            this.y += (this.speedY);
        },
        get width(){
            return this.radio*2;
        },
        get height(){
            return this.radio*2;
        },
        collision: function (bar) {
            //reacciona a la colision con una barra que recibe como parámetro
            var relative_intersect_y =(bar.y + (bar.height / 2)) - this.y;

            var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
            console.log(this.bounce_angle);
            this.speedY = this.speed * (-Math.sin(this.bounce_angle));
            this.speedX = this.speed * Math.cos(this.bounce_angle);

            if (this.x > (this.board.width / 2)) this.direction = -1;
            else this.direction = 1;
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

        //valocidad de las barras
        this.speed = 10;
    }

    //prototipo de la clase Bar
    self.Bar.prototype = {
        //movimiento de las barras
        down: function () {
            this.y += this.speed;
        },
        up: function () {
            this.y -= this.speed
        },

        //para ver por consola si las coordendas si se mueven al presionar una tecla 
        toString: function () {
            return "x: " + this.x + " y: " + this.y;
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
        //para limpiar la pantalla con el nuevo frame de barras
        clean: function () {
            this.context.clearRect(0, 0, this.board.width, this.board.height); //coordenadas 0,0, y limpiar hasta las dimensiones del board
        },
        draw: function () {
            //elements es el getter del Board que devuelve las barras y la pelota
            for (var i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i];
                draw(this.context, el);
            }
        },

        checkCollisions: function () {
            
            for (var i = this.board.bars.length - 1; i >= 0; i--) {
                var bar = this.board.bars[i]
                if (hit(bar, this.board.ball)) {
                    this.board.ball.collision(bar);
                }
            };
        },
        play: function () {
            if (this.board.playing) {
                this.clean();
                this.draw();
                this.checkCollisions();
                this.board.ball.move();
            }

        }
    }

    //---------------helper methods
    //dibujará los elementos
    function draw(context, element) {

        switch (element.kind) {
            case "rectangle":
                context.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                context.beginPath();
                context.arc(element.x, element.y, element.radio, 0, 7);
                context.fill();
                context.closePath();
                break;
        }
    }

    //revisa las colisiones
    function hit(a, b) {
        
        //revisa si a colisiona con b
        var hit = false;
        //colisiones horizontales
        if (b.x + b.width >= a.x && b.x < a.x + a.width) {
            //colisiones verticales
            if (b.y + b.height >= a.y && b.y < a.y + a.height) {
                hit = true;
            }
        }

        //colision de a con b
        if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
            if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
                hit = true;
            }
        }

        //colision de b con a
        if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
            if (a.y <= b.y && a.y + a.height >= b.y + b.height)
                hit = true;
        }
        return hit;

    }
})();

//para tener acceso a las barras de manera global y no solo desde el main para aplicarles funciones, las sacamos del main
var board = new Board(800, 400);
var bar = new Bar(20, 100, 40, 100, board);
var bar2 = new Bar(700, 100, 40, 100, board);
var canvas = document.getElementById('canvas');
var boardView = new BoardView(canvas, board);
var ball = new Ball(300, 100, 10, board)



//evento que escucha las teclas del teclado usando directamente el DOM
document.addEventListener("keydown", function (ev) {

    if (ev.keyCode == 38) {
        ev.preventDefault(); //lo pasamos para adentro para tener control de las letras que queremos tener contorl, No todo el teclado
        bar.up();
    } else if (ev.keyCode === 40) {
        ev.preventDefault();
        bar.down();
    } else if (ev.keyCode === 87) {
        //w
        ev.preventDefault();
        bar2.up();
    } else if (ev.keyCode === 83) {
        //s
        ev.preventDefault();
        bar2.down();
    } else if (ev.keyCode === 32) { // para la barra espaciadora
        ev.preventDefault();
        board.playing = !board.playing; //para pausar el juego
    }

    //console.log(bar2.toString())
});

boardView.draw();//para dibujar por primara vez 

//self.addEventListener("load", main);
window.requestAnimationFrame(controller);

//ejecuta todos los elementos
function controller() {

    boardView.play();

    //animacion de las barras de las barras y se refresque constantemente actualizando los frames
    window.requestAnimationFrame(controller);
}