/**
 * Created by Administrator on 2016/11/18.
 */
;(function($){
    $.fn.extend({

        // 构造函数（对象：当前进度、100%时 显示的内容，都非必填）
        'progressBar': function( obj ){

            // 进度条 默认配置项
            var configObj = {
                'currentProgress': 0, // 当前进度
                'completeText': '100%', // 100%时 显示的内容
            };
            configObj = $.extend( configObj, obj ); // 合并参数

            // 设置参数，避免不法输入
            configObj.currentProgress = parseInt( configObj.currentProgress );// 当前进度 取整
            if( isNaN( configObj.currentProgress ) ) configObj.currentProgress = 0; // 输入非数字时，configObj.currentProgress == NaN
            if( configObj.currentProgress > 100 ) configObj.currentProgress = 100;// 进度不能 超过100%
            // console.log( configObj );


            // 判断是否是初始化  （有以下两个子元素，就不是初始化；没有以下某一元素，都是初始化）
            if( !$(this).children('.progressBar-label').length  ||  !$(this).children('.progressBar-value').length ){ // 是初始化

                // 插入html
                var $str = $( '<div class="progressBar-label"></div> <div class="progressBar-value"></div>' );
                $(this).addClass('progressBar').append( $str );

                // 设置 100%时 显示的内容（防止程序后续操作 修改初始化的内容）
                $(this).attr( 'completeText', configObj.completeText );

            }else{ // 不是 初始化
                configObj.completeText = $(this).attr('completeText');// 取出初始化时 规定的：100%时 显示的内容
            }


            // 设置进度条 显示内容
            var _text = ( configObj.currentProgress >= 100 ? configObj.completeText : configObj.currentProgress + '%' );
            $(this).children('.progressBar-label').text( _text ); // 进度条 显示内容

            // 设置进度条 显示长度
            $(this).children('.progressBar-value').css( 'width', configObj.currentProgress + '%' );

            // 设置 当前进度属性（数字），方便用户读取进度
            $(this).attr('currentProgress', configObj.currentProgress);
        },

    });
})( jQuery );