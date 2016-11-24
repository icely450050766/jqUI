/**
 * Created by Administrator on 2016/11/21.
 */
var autoComplete = ( function($){
    return{

        $input: null,// 输入框
        $autoCompleteBox: null,// 自动完成的box

        // 初始化
        init: function( $input, url, data ){
            this.$input = $input;

            this.appendAutoCompleteBox();// 在$input后 插入html（自动完成的box）
            this.getAllData( url, data );// 获取 所有数据
            this.addEvent(); // 事件处理
        },

        // 插入html（自动完成的box）
        appendAutoCompleteBox: function(){

            if( !this.$input.prev('.autoCompleteBox').length ){

                this.$autoCompleteBox = $('<div class="autoCompleteBox"></div>');
                this.$input.after( this.$autoCompleteBox );// 没有.autoCompleteBox，插入

                this.$autoCompleteBox.css( 'width', this.$input.css('width') );// 调整 .autoCompleteBox 宽度
                this.$autoCompleteBox.hide();// 隐藏 下拉列表
            }
        },

        // 获取 所有数据
        getAllData: function( url, data ){

            var _self = this;
            this.postData( url, data, function(data){
                //console.log( data );
                data = data.data;

                var _content = '';
                for( var i=0; i < data.length; i++ ){
                    _content += '<div class="option" value="' + data[i] + '" text="' + data[i] + '">' + data[i] + '</div>';
                }
               _self.$autoCompleteBox.html( _content );
            });
        },

        // 事件处理
        addEvent: function(){

            var _self = this;

            // 监听 输入框
            _self.$input.on('keyup', function( e ) {

                //console.log( e.keyCode );
                var _keyCode = e.keyCode;

                // 按键前，匹配的option
                var $matchOptions = _self.$autoCompleteBox.children('.option:visible');
                console.log( $matchOptions );

                // 当前被选中的 option
                var hoverOptionIndex = null;
                $matchOptions.each(function (index) {
                    if ($(this).is('.hoverClass')) hoverOptionIndex = index;
                });

                // 判断是否是操作 下拉列表项
                if ( _keyCode == 38  ||  _keyCode == 40  ||  _keyCode == 13 ) {

                    if( !$matchOptions.length ) return;// 没有匹配的option，无法操作下拉列表项

                    // 操作下拉列表项，选择、选中 某个option
                    switch (_keyCode) {

                        case 38: { // ↑
                            if ( hoverOptionIndex != null ) {
                                hoverOptionIndex --;
                                if ( hoverOptionIndex < 0 ) hoverOptionIndex = 0;// 判断是否是 第一个option
                                $matchOptions.eq( hoverOptionIndex ).trigger('mouseover');
                            }
                            break;
                        }
                        case 40: { // ↓
                            //console.log( hoverOptionIndex)
                            if ( hoverOptionIndex == null ) hoverOptionIndex = 0;
                            else {
                                hoverOptionIndex ++;
                                if ( hoverOptionIndex >= $matchOptions.length ) hoverOptionIndex = $matchOptions.length - 1;// 判断是否是 最后的option
                            }
                            $matchOptions.eq( hoverOptionIndex ).trigger('mouseover');
                            break;
                        }
                        case 13: { // 回车
                            $matchOptions.eq( hoverOptionIndex ).trigger('click');
                            break;
                        }
                    }

                } else { // 不是操作option，筛选出匹配的 option，显示

                    //console.log( $(this).val() );
                    _self.$autoCompleteBox.children('.option').hide();// 隐藏所有
                    $matchOptions = _self.$autoCompleteBox.children('.option[text^=' + $(this).val() + ']');// 匹配 的option

                    if ($matchOptions.length) {

                        _self.$autoCompleteBox.show(); // 显示 下拉列表
                        $matchOptions.show();// 显示 匹配的 下拉列表项
                    }
                    else _self.$autoCompleteBox.hide(); // 隐藏 下拉列表
                }
            });

            // 下拉项 mouseover事件（不用hover，移入、移除都会触发hover事件）
            _self.$autoCompleteBox.on('mouseover', '.option', function(){
                _self.$autoCompleteBox.find('.hoverClass').removeClass('hoverClass');
                $(this).addClass('hoverClass');
            });

            // 下拉项 点击事件
            _self.$autoCompleteBox.on('click', '.option', function(){

                $(this).removeClass('hoverClass');

                //console.log( $(this).attr('text') );
                _self.$input.val( $(this).attr('text') );
                _self.$autoCompleteBox.hide();// 隐藏 下拉列表
            });
        },

        // 获取数据
        postData: function( url, data, successFunc, errFunc ){
            $.ajax({
                url : url,
                data : data,
                type: 'POST',
                success: function( data ){ successFunc(data); },
                error: function( err ){ errFunc(err); }
            })
        },
    }
})( jQuery );