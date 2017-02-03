const canvasPreloader = {

    options: {
        startPixelsCount: 2,

    },

    initImage: function(context, container){
        let fullImage = new Image(),
            _this = this;
        fullImage.src = container.dataset.src;

        fullImage.onload = function(){
            _this.drawingImage(context, fullImage);
        }
    },

    initCanvas: function(){
        let canvas = document.getElementById('canvasImg'),
            container = document.getElementById('canvasContainer'),
            rgb = {r:0,g:0,b:0},
            context = canvas.getContext('2d'),
            height = container.offsetHeight,
            width = container.offsetWidth;

        context.height = canvas.height = height;
        context.width = canvas.width = width;

        this.initImage(context, container)
    },

    drawingImage: function(context, image){

        context.drawImage(image, 0, 0);

    },

    init: function(){
        this.initCanvas()
    }

};

canvasPreloader.init();
