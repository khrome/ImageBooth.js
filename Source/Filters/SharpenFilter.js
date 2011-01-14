var ImBo_Sharpen_Filter = new Class({
    Extends : ImBo_Filter,
    getLabel : function(){
        return 'Sharpen';
    },
    sharpenMatrix : function(k){return [
        [  -1*k, -1*k, -1*k ],
        [  -1*k,  8*k+1, -1*k ],
        [  -1*k, -1*k, -1*k ]
    ];},
    name : function(){
        return 'sharpen';
    },
    filter: function(pixels, controls){
        return ImageBooth.convolve(pixels, this.sharpenMatrix(controls.k), controls.amount, controls.threshold);;
    },
    getControls : function(){
        return {
            'k' : {
                'value' : '4',
                'default' : '4',
                'upper_bound' : '4',
                'lower_bound' : '0'
            },
            'amount' : {
                'value' : '2',
                'default' : '2',
                'upper_bound' : '20',
                'lower_bound' : '0'
            },
            'threshold' : {
                'value' : '5',
                'default' : '5',
                'upper_bound' : '10',
                'lower_bound' : '0'
            },
        };
    }
});