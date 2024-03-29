var ImageBooth = {
    // registries
    filters : [],
    transformations : [],
    operations : [],
    brushes : [],
    tools : [],
    foreground : '000000',
    background : 'FFFFFF',
    gui: null,
    currentImage : null,
    currentBrush : null,
    currentTool : null,
    clonePosition : null,
    cloneBrushPosition : null,
    // init
    startup: function(){
        Bootstrap.initialize(
            [
                {
                    name : 'MooTools',
                    signature : 'document.id',
                    location : 'Lib/mootools-1.2.4-core.js'
                },
                {
                    name : 'MooTools.More',
                    location : 'Lib/mootools-1.2.4.2-more.js',
                    depends : 'MooTools'
                },
                {
                    name : 'Image',
                    location : 'Core/Image.js',
                    depends : 'MooTools.More'
                },
                {
                    name : 'Layer',
                    location : 'Core/Layer.js',
                    depends : 'MooTools.More'
                },
                {
                    name : 'Filter',
                    location : 'Core/Filter.js',
                    depends : 'MooTools.More'
                },
                {
                    name : 'Brush',
                    location : 'Core/Brush.js',
                    depends : 'MooTools.More'
                },
                {
                    name : 'Operation',
                    location : 'Core/Operation.js',
                    depends : 'MooTools.More'
                },
                {
                    name : 'Tool',
                    location : 'Core/Tool.js',
                    depends : 'MooTools.More'
                }
            ],
            function(){
                // you are now loaded, do your stuff here
                this.load('operations', 'Negative');
                this.load('operations', 'BrightnessContrast');
                
                this.load('filters', 'GaussianBlurFilter');
                this.load('filters', 'SobelFilter');
                this.load('filters', 'LaplacianFilter');
                this.load('filters', 'SharpenFilter');
                this.load('filters', 'EmbossFilter');
                this.load('filters', 'HighPassFilter');
                
                this.load('brushes', '1pxSquareBrush');
                this.load('brushes', '3pxRoundBrush');
                this.load('brushes', '5pxSquareBrush');
                this.load('brushes', '5pxRoundBrush');
                this.load('brushes', '5pxSoftRoundBrush');
                this.load('brushes', '10pxScatterBrush');
                this.load('brushes', '10pxSoftRoundBrush');
                this.load('brushes', '15pxSoftRoundBrush');
                this.load('brushes', '20pxSoftRoundBrush');
                this.load('brushes', '40pxSoftRoundBrush');
                
                this.load('tools', 'Paintbrush');
                this.load('tools', 'Eraser');
                this.load('tools', 'Clone');
                this.load('tools', 'Eyedropper');
                this.load('tools', 'Paintbucket');
                
            }.bind(this)
        );
        /*if(ImageBooth.filters.length == 0){
            ImageBooth.registerFilter(new ImBo_Gaussian_Blur_Filter());
            ImageBooth.registerFilter(new ImBo_Sobel_Filter());
            ImageBooth.registerFilter(new ImBo_Laplacian_Filter());
            ImageBooth.registerFilter(new ImBo_Sharpen_Filter());
            ImageBooth.registerFilter(new ImBo_Emboss_Filter());
            ImageBooth.registerFilter(new ImBo_High_Pass_Filter());
            
            ImageBooth.registerOperation(new ImBo_Negative());
            ImageBooth.registerOperation(new ImBo_BightnessContrast());
            
            ImageBooth.registerBrush(new ImBo_1px_Square_Brush());
            ImageBooth.registerBrush(new ImBo_3px_Round_Brush());
            ImageBooth.registerBrush(new ImBo_5px_Square_Brush());
            ImageBooth.registerBrush(new ImBo_5px_Round_Brush());
            ImageBooth.registerBrush(new ImBo_5px_Soft_Round_Brush());
            ImageBooth.registerBrush(new ImBo_10px_Scatter_Brush());
            ImageBooth.registerBrush(new ImBo_10px_Soft_Round_Brush());
            ImageBooth.registerBrush(new ImBo_15px_Soft_Round_Brush());
            ImageBooth.registerBrush(new ImBo_20px_Soft_Round_Brush());
            ImageBooth.registerBrush(new ImBo_40px_Soft_Round_Brush());
            
            ImageBooth.registerTool(new ImBo_Paintbrush());
            ImageBooth.registerTool(new ImBo_Eraser());
            ImageBooth.registerTool(new ImBo_Clone());
            ImageBooth.registerTool(new ImBo_Eyedropper());
            ImageBooth.registerTool(new ImBo_Paintbucket());
        }*/
    },
    load : function(type, name){
        var id = type[0].toUpperCase()+type.substring(1).toLowerCase()+'/'+name+'.js';
        Bootstrap.JS(id);
    }
    log : function(value){
        if(console) {
            if(navigator.userAgent.toLowerCase().indexOf("applewebkit") != -1) {
                console.log(value);
            } else {
                console.log.apply(this,arguments);
            }
        }
    },
    bindGUI : function(gui){
        this.gui = gui;
    },
    //registration
    registerFilter: function(filter){
        ImageBooth.filters[filter.name()] = filter;
    },
    registerOperation: function(operation){
        ImageBooth.operations[operation.name()] = operation;
    },
    registerTransformation: function(transformation){
        ImageBooth.transformations[transformation.name()] = transformation;
    },
    registerBrush: function(brush){
        if(ImageBooth.currentBrush == null) ImageBooth.currentBrush = brush.name();
        ImageBooth.brushes[brush.name()] = brush;
    },
    registerTool: function(tool){
        if(ImageBooth.currentTool == null) ImageBooth.currentTool = tool.name();
        ImageBooth.tools[tool.name()] = tool;
    },
    //core
    newImage : function(img){
        var img = new ImBo_Image(document.id('body'));
        ImageBooth.currentImage = img;
        return img;
    },
    filter : function(name, layer, controls){
        ImageBooth.checkInitialization();
        if(!controls && this.gui){
            var controls = ImageBooth.filters[name].getControls();
            var count = 0;
            for(controlKey in controls) count++;
            if(count == 0){
                if(ImageBooth.filters[name] != null) return ImageBooth.filters[name].filter(layer.pixels, controls);
                return;
            }
            if(this.gui) this.gui.makeOptionsWindow(name, controls, layer, this.filter);
        }else{
            var target = layer;
            if (target.layer_signature) target = target.pixels;
            if(ImageBooth.filters[name] != null) return ImageBooth.filters[name].filter(target, controls);
            else ImageBooth.error('OMG no filter! '+name);
        }
    },
    transform : function(name, layer, controls){
        ImageBooth.checkInitialization();
        if(ImageBooth.transformations[name] != null) return ImageBooth.transformations[name].transform(layer, controls);
        else ImageBooth.error('OMG no transformation! '+name);
    },
    operate : function(name, layer, controls){
        ImageBooth.checkInitialization();
        if(!controls && this.gui){
            var controls = ImageBooth.operations[name].getControls();
            var count = 0;
            for(controlKey in controls) count++;
            if(count == 0){
                if(ImageBooth.operations[name] != null) return ImageBooth.operations[name].operate(layer.pixels, controls);
                return;
            }
            if(this.gui) this.gui.makeOptionsWindow(name, controls, layer, this.operate);
        }else{
            var target = layer;
            if (target.layer_signature) target = target.pixels;
            if(ImageBooth.operations[name] != null) return ImageBooth.operations[name].operate(target, controls);
            else ImageBooth.error('OMG no filter! '+name);
        }
    },
    brush : function(name, layer, x, y, controls){
        ImageBooth.checkInitialization();
        if(ImageBooth.brushes[name] != 'undefined'){
            if(ImageBooth.brushes[name].getBrush == undefined) ImageBooth.error('no brush! '+name);
            else if(ImageBooth.currentTool == null || ImageBooth.tools[ImageBooth.currentTool].paint == undefined) ImageBooth.error('no tool ! '+ImageBooth.currentTool);
            else return ImageBooth.tools[ImageBooth.currentTool].paint(ImageBooth.brushes[name].getBrush(), layer, x, y);
        }
        else ImageBooth.error('OMG no brush! '+name);
    },
    // Utility functions
    brushDimensions: function(name){
        ImageBooth.checkInitialization();
        if(ImageBooth.brushes[name] != 'undefined'){
            return {x:ImageBooth.brushes[name].brush.length, y:ImageBooth.brushes[name].brush[0].length};
        }
        else return {x:0, y:0};
    },
    decodeHex: function(color){
        var result = [
            parseInt(color.substring(0,2), 16),
            parseInt(color.substring(2,4), 16),
            parseInt(color.substring(4,6), 16) 
        ];
        return result;
    },
    performConvolution : function(pixels, convolution_matrix, levels){
        if(levels == undefined) levels = convolution_matrix.length * convolution_matrix[0].length;
        return ImageBooth.convolve(pixels, convolution_matrix, levels, 0);
        
    },
    error : function(message){
        ImageBooth.log(message);
    },
    flipY : function(matrix){
        var temp;
        var matrixCopy = matrix;
        var end = matrix.length-1;
        var half = matrix.length/2+1;
        for(var lcv = 0; lcv < half ; lcv++){
            matrixCopy[lcv] = matrix[end-lcv];
            matrixCopy[end-lcv] = matrix[lcv];
        }
        return matrixCopy;
    },
    flipX : function(matrix){
        var temp;
        var matrixCopy = matrix;
        var end = matrix.length-1;
        for(var y = 0; y < matrix.length; y++){
            for(var x = 0; x < matrix.width/2+1; x++){
                matrixCopy[y][lcv] = matrix[y][end-lcv];
                matrixCopy[y][end-lcv] = matrix[y][lcv];
            }
        }
        return matrixCopy;
    },
    convolveBuffer : new Element('canvas'),
    convolve: function(pixels, filter, filter_div, offset){ //src == image
        if (pixels == null){
            ImageBooth.error('Tried to convolve nothing!');
        }
        //setup buffer
        ImageBooth.convolveBuffer.setProperty('width', pixels.width);
        ImageBooth.convolveBuffer.setProperty('height', pixels.height);
        var context = ImageBooth.convolveBuffer.getContext('2d');
        var newPixels  = context.getImageData(0,0, pixels.width, pixels.height);
        var sx = pixels.width; //getx
        var sy = pixels.height; //gety
        var new_r, new_g, new_b, new_a, alpha, yv, pxl, new_pxl, kernel_size;
        //kernel_size = filter.length; //coming soon
        for(var y = 0; y < sy; y++){
            for(x = 0; x < sx; x++){
                new_r = new_g = new_b = 0;
                new_a = pixels.data[((y*(sx*4)) + (x*4)) + 3];
                //convolve this pixel to produce this pixel's value
                for(var j = 0; j < filter.length; j++) { //rows
                    yv = Math.min( Math.max(y - 1 + j, 0), sy - 1);
                    for(var i = 0; i < filter[j].length; i++) { //cols
                        pxl = [ Math.min( Math.max(x - 1 + i, 0), sx - 1), yv]; 
                        if(filter[j] && filter[j][i]){
                            new_r += pixels.data[((pxl[1]*(sx*4)) + (pxl[0]*4))    ] * filter[j][i];
                            new_g += pixels.data[((pxl[1]*(sx*4)) + (pxl[0]*4)) + 1] * filter[j][i];
                            new_b += pixels.data[((pxl[1]*(sx*4)) + (pxl[0]*4)) + 2] * filter[j][i];
                        }
                    }
                }
                if ((y >= 0) && (y < sy)) { //y coordinate in range?
                    //
                    new_r = (new_r/filter_div)+offset;
                    new_g = (new_g/filter_div)+offset;
                    new_b = (new_b/filter_div)+offset;
                    //bound 0 .. 255
                    new_r = (new_r > 255)? 255 : ((new_r < 0)? 0:new_r); 
                    new_g = (new_g > 255)? 255 : ((new_g < 0)? 0:new_g);
                    new_b = (new_b > 255)? 255 : ((new_b < 0)? 0:new_b);
                    //copy the altered values for this pixel into the buffer we created
                    newPixels.data[((y*(sx*4)) + (x*4))    ] += new_r;
                    newPixels.data[((y*(sx*4)) + (x*4)) + 1] += new_g;
                    newPixels.data[((y*(sx*4)) + (x*4)) + 2] += new_b;
                    newPixels.data[((y*(sx*4)) + (x*4)) + 3] += new_a;
                }
            }
        }
        // return the buffer
        return newPixels;
    },
    merge: function(aPixels, bPixels, buffer, mode, opacity){ //src == image 
        //for clarity's sake, we are layering layer a over layer b
        if (aPixels == null || bPixels == null) ImageBooth.error('Tried to convolve nothing!');
        if(aPixels.height != bPixels.height || aPixels.width != bPixels.width){
            ImageBooth.error('Mismatched pixel sizes');
            ImageBooth.error(aPixels);
            ImageBooth.error(bPixels);
        }
        if(mode == null) mode = 'overlay';
        //setup buffer
        var newPixels;
        if(!buffer || buffer == null){
            ImageBooth.convolveBuffer.setProperty('width', aPixels.width);
            ImageBooth.convolveBuffer.setProperty('height', aPixels.height);
            var context = ImageBooth.convolveBuffer.getContext('2d');
            newPixels  = context.getImageData(0,0, aPixels.width, aPixels.height);
        }else{
            newPixels = buffer.getImageData(0,0, aPixels.width, aPixels.height);
        }
        var sx = aPixels.width; //getx
        var sy = aPixels.height; //gety
        switch(mode){
            case 'average':
                
                break;
            case 'lighten':
                for(var y = 0; y < sy; y++){
                    for(x = 0; x < sx; x++){
                        newPixels.data[((y*(sx*4)) + (x*4))     ] = Math.max(
                            aPixels.data[((y*(sx*4)) + (x*4))     ],
                            bPixels.data[((y*(sx*4)) + (x*4))     ]
                        );
                        newPixels.data[((y*(sx*4)) + (x*4)) + 1 ] = Math.max(
                            aPixels.data[((y*(sx*4)) + (x*4)) + 1 ],
                            bPixels.data[((y*(sx*4)) + (x*4)) + 1 ]
                        );
                        newPixels.data[((y*(sx*4)) + (x*4)) + 2 ] = Math.max(
                            aPixels.data[((y*(sx*4)) + (x*4)) + 2 ],
                            bPixels.data[((y*(sx*4)) + (x*4)) + 2 ]
                        );
                        newPixels.data[((y*(sx*4)) + (x*4)) + 3 ] = Math.max(
                            aPixels.data[((y*(sx*4)) + (x*4)) + 3 ],
                            bPixels.data[((y*(sx*4)) + (x*4)) + 3 ]
                        );
                    }
                }
                break;
            case 'darken':
                for(var y = 0; y < sy; y++){
                    for(x = 0; x < sx; x++){
                        newPixels.data[((y*(sx*4)) + (x*4))     ] = Math.min(
                            aPixels.data[((y*(sx*4)) + (x*4))     ],
                            bPixels.data[((y*(sx*4)) + (x*4))     ]
                        );
                        newPixels.data[((y*(sx*4)) + (x*4)) + 1 ] = Math.min(
                            aPixels.data[((y*(sx*4)) + (x*4)) + 1 ],
                            bPixels.data[((y*(sx*4)) + (x*4)) + 1 ]
                        );
                        newPixels.data[((y*(sx*4)) + (x*4)) + 2 ] = Math.min(
                            aPixels.data[((y*(sx*4)) + (x*4)) + 2 ],
                            bPixels.data[((y*(sx*4)) + (x*4)) + 2 ]
                        );
                        newPixels.data[((y*(sx*4)) + (x*4)) + 3 ] = Math.min(
                            aPixels.data[((y*(sx*4)) + (x*4)) + 3 ],
                            bPixels.data[((y*(sx*4)) + (x*4)) + 3 ]
                        );
                    }
                }
                break;
            case 'overlay':
                var index, a_alpha, b_alpha;
                for(var y = 0; y < sy; y++){
                    for(x = 0; x < sx; x++){
                        index = ((y*(sx*4)) + (x*4));
                        a_alpha = aPixels.data[index  + 3];
                        if(a_alpha == 0){
                            newPixels.data[index    ] =  bPixels.data[index     ];
                            newPixels.data[index + 1 ] = bPixels.data[index + 1 ];
                            newPixels.data[index + 2 ] = bPixels.data[index + 2 ];
                            newPixels.data[index + 3 ] = bPixels.data[index + 3 ];
                        }else if (a_alpha == 255){
                            newPixels.data[index    ] =  aPixels.data[index     ];
                            newPixels.data[index + 1 ] = aPixels.data[index + 1 ];
                            newPixels.data[index + 2 ] = aPixels.data[index + 2 ];
                            newPixels.data[index + 3 ] = a_alpha;
                        }else{
                            //technically b should be a composite, and not use additive 
                            var a_combine_amount = a_alpha/255;
                            var b_combine_amount = (255-a_alpha)/255;
                            var b_alpha = bPixels.data[index  + 3];
                            newPixels.data[index    ] = 
                                (aPixels.data[index     ] * a_combine_amount) 
                                + (bPixels.data[index     ] * b_combine_amount)
                            ;
                            newPixels.data[index + 1 ] = 
                                (aPixels.data[index + 1 ] * a_combine_amount) 
                                + (bPixels.data[index + 1 ] * b_combine_amount)
                            ;
                            newPixels.data[index + 2 ] = 
                                (aPixels.data[index + 2 ] * a_combine_amount) 
                                + (bPixels.data[index + 2 ] * b_combine_amount)
                            ;
                            newPixels.data[index + 3 ] = Math.max(a_alpha, b_alpha);
                        }
                    }
                }
                break;
        }
        buffer.putImageData(newPixels, 0, 0);
        return newPixels;
    },
    rotate: function(layer, angle, anchor){
    },
    hexDump: function(buffer, x, y){
        var data = '';
        var pos;
        for(var ypos = 0; ypos < y; ypos++){
            for(xpos = 0; xpos < x; xpos++){
                pos = ((ypos*(x*4)) + (xpos*4));
                data  += 
                    buffer.data[pos    ].toString(16).toUpperCase() +
                    buffer.data[pos + 1].toString(16).toUpperCase() +
                    buffer.data[pos + 2].toString(16).toUpperCase() +
                    buffer.data[pos + 3].toString(16).toUpperCase();
            }
            data += '\n';
        }
        return data;
    },
    imageObject: function(buffer){
        var uri = buffer.toDataURL();
        var obj = new Element('img', {
            src : uri
        });
        if(!obj.width) obj.width = buffer.width;
        if(!obj.height) obj.height = buffer.height;
        //document.body.appendChild(obj);
        return obj;
    },
    imageDump: function(buffer, type){
        if(type == null) type = 'png';
        var uri = buffer.toDataURL();
        var result = '';
        var signature = 'data:image/'+type+';base64,';
        if(uri.startsWith(signature)){
            var data = uri.substr(signature.length);
            return data;
        }else{
            //blow up
        }
    }
};
ImageBooth.startup();