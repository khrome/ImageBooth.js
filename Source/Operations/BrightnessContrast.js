var ImBo_BightnessContrast = new Class({
    Extends: ImBo_Operation,
    name : function(){
        return 'brightness_contrast';
    },
    getLabel : function(){
        return 'Brightness/Contrast';
    },
    operate: function(pixels, controls){
        ImageBooth.convolveBuffer.setProperty('width', pixels.width);
        ImageBooth.convolveBuffer.setProperty('height', pixels.height);
        controls.contrast = (controls.contrast+150)/150;
        //controls.brightness = (controls.brightness+150)/150;
        var context = ImageBooth.convolveBuffer.getContext('2d');
        var newPixels  = context.getImageData(0,0, pixels.width, pixels.height);
        var sx = pixels.width; //getx
        var sy = pixels.height; //gety
        var legacy = true;
		//contrast = Math.max(0,controls.contrast+1);
        var mul, add;
        if (legacy) {
            mul = controls.contrast;
            add = (Math.min(150,Math.max(-150,controls.brightness)) - 128) * controls.contrast + 128;
        } else {
            mul = (1 + Math.min(150,Math.max(-150,controls.brightness)) / 150) * controls.contrast;
            add = - controls.contrast * 128 + 128;
        }
        for(var y = 0; y < sy; y++){
            for(x = 0; x < sx; x++){
                pos = ((y*(sx*4)) + (x*4));
                r = pixels.data[pos    ] * mul + add;
                g = pixels.data[pos + 1] * mul + add;
                b = pixels.data[pos + 2] * mul + add;
                newPixels.data[pos    ] = (r < 255)? ((r < 0)? 0 : r) : 255;
                newPixels.data[pos + 1] = (g < 255)? ((g < 0)? 0 : g) : 255;
                newPixels.data[pos + 2] = (b < 255)? ((b < 0)? 0 : b) : 255;
                newPixels.data[pos + 3] = pixels.data[pos + 3];
            }
        }
        return newPixels;
    },
    getControls : function(){
        return {
            'brightness' : {
                'value' : '1',
                'default' : '1',
                'upper_bound' : '150',
                'lower_bound' : '-150'
            },
            'contrast' : {
                'value' : '1',
                'default' : '1',
                'upper_bound' : '150',
                'lower_bound' : '-150'
            },
        };
    }
});
