function canvasPreloader(id){

    this.startWidth = 1;
    this.startHeight = 1;
    this.paintDelay = 100;
    this.size = {
        x: 0,
        y: 0
    };

    let wrapper = document.getElementById(id),
        canvas = document.createElement("canvas"),
        context = canvas.getContext('2d'),
        tempCanvas = document.createElement("canvas"),
        tempContext = tempCanvas.getContext('2d'),
        precision = 15,
        blocksH = 0,
        blocksW = 0,
        height = wrapper.offsetHeight,
        width = wrapper.offsetWidth,
        _this = this;

    function initImage(){
        let fullImage = new Image();
        fullImage.src = wrapper.dataset.src;

        fullImage.onload = function(){
            drawingHiddenImage(fullImage);
            _this.fullImage = fullImage;
        };
    }

    function getAverageImageColor(ctx, x, y, width, height) {
        let imageData = ctx.getImageData(x, y, width, height),
            data = imageData.data,
            rgb = {r:0,g:0,b:0},
            count = 0;

        if(precision > width || precision > height) {
            precision = 1;
        }

        for(let i = 0; i < data.length; i += 4 * precision ){
            rgb.r += data[i];
            rgb.g += data[i+1];
            rgb.b += data[i+2];
            count++;
        }

        rgb.r = ~~(rgb.r/count);
        rgb.g = ~~(rgb.g/count);
        rgb.b = ~~(rgb.b/count);

        return rgb;
    }

    function initCanvas(){
        context.height = tempContext.height = canvas.height = tempCanvas.height = height;
        context.width = tempContext.width = canvas.width = tempCanvas.width = width;

        wrapper.appendChild(canvas);
        wrapper.appendChild(tempCanvas);

        tempCanvas.classList.add('temp-canvas');

        initImage();
    }

    function drawingHiddenImage(image){
        tempContext.drawImage(image, 0, 0);

        let paintTimer = setTimeout(function repaint() {

            blocksPainting();

            //console.log(_this.size.y);

            if( _this.size.x < width && _this.size.y < height ) {
                setTimeout(repaint, _this.paintDelay)
            }else{
                paintImage();
            }
        }, _this.paintDelay);
    }
    
    function paintImage() {
        context.filter = 'blur(5px)';
        context.drawImage(_this.fullImage, 0, 0);
        setTimeout(function () {
            context.globalAlpha = 1;
            context.filter = 'none';
            context.drawImage(_this.fullImage, 0, 0);
        }, _this.paintDelay);
    }

    function blocksPainting() {
        let blocksW =  _this.size.x || _this.startWidth,
            blocksH = _this.size.y || _this.startHeight,
            sectionWidth = width/blocksW,
            sectionHeight = height/blocksH,
            color;

        console.time('test');

        if(sectionWidth > precision && sectionHeight > precision) {

            for (let i = 0; i < blocksH; i++) {
                for (let j = 0; j < blocksW; j++) {
                    color = getAverageImageColor(tempContext, j * sectionWidth, i * sectionHeight, sectionWidth, sectionHeight);
                    paintBlock(color, context, j * sectionWidth, i * sectionHeight, sectionWidth, sectionHeight);
                }
            }

            _this.size.x = blocksW*2;
            _this.size.y = blocksH*2;

        } else {
            _this.size.x = width;
            _this.size.y = height;
        }

        console.timeEnd('test');


    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    function paintBlock(color, ctx, x, y, blockWidth, blockHeight){
        ctx.fillStyle = rgbToHex(color.r, color.g, color.b);
        ctx.globalAlpha = 0.2;
        ctx.fillRect(x, y, blockWidth, blockHeight);
    }
    
    this.init = function(){
        initCanvas()
    }

}

let preloader = new canvasPreloader('canvasContainer');
preloader.startHeight = 1;
preloader.startWidth = 2;
preloader.init();
