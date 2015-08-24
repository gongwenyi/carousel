;(function($, window, document, undefined){
  var Carousel = function(ele){                             //提供一个选择器作为参数
    var self = this;                                        //Carousel

    this.$element = ele;                                    //幻灯片的最外层目标元素
    this.$lis = ele.find('.carousel-main li');              //包裹图片的li元素
    this.$btn_next = ele.find('.play-btn-next');            //下一张按钮
    this.$btn_prev = ele.find('.play-btn-prev');            //上一张按钮
    this.$menus = ele.find('.carousel-menu a');             //每张图的导航按钮
    this.current_index = 0;                                 //当前显示的图片的下标
    this.next_index = 0;                                    //下一张要显示图片的下标
    this.prev_index = 0;                                    //上一张要显示图片的下标
    this.defaults = {                                       //默认参数配置
       'width': 800,                                        //宽度
       'height': 350,                                       //高度
       'autoplay': true,                                    //自动播放
       'speed': 800,                                        //动画时间
       'delay': 5000                                        //间隔时间
    };
    //合并参数
    $.extend(this.defaults, this.getSetting());
    //初始化宽高
    this.setSetting();

    //下一张按钮点击事件
    this.$btn_next.on('click', function(){
      self.moveNext();
    });

    //上一张按钮点击事件
    this.$btn_prev.on('click', function(){
      self.movePrev();
    });

    //图片按钮点击事件
    this.$menus.each(function(index){
       $(this).data('data-index',index).on('click',function(){
         self.moveTo($(this).data('data-index'));
       });
    });

    //是否自动播放
    if(this.defaults.autoplay){
      this.autoplay();
      this.$element.hover(
        function(){
          window.clearInterval(self.timer);
        },
        function(){
          self.autoplay();
        }
      );
    }

  };

  Carousel.prototype = {
    //获取人工配置参数
    getSetting: function(){
      var setting = this.$element.attr('data-setting');
      if(setting && setting!=""){
        return $.parseJSON(setting);
      }else{
        return {};
      }
    },

    //设置人工配置的宽高值
    setSetting: function(){
      this.$element.css({
        'width': this.defaults.width,
        'height': this.defaults.height
      });
    },

    //播放下一张
    moveNext: function(){
      if(!this.$lis.is(':animated')){
        this.next_index = this.current_index + 1;
        this.next_index = this.next_index>=this.$lis.length ? 0 : this.next_index;
        this.$lis.eq(this.current_index).animate({
          'left': '-100%'
        },this.defaults.speed);
        this.$lis.eq(this.next_index).css({'left':'100%','z-index':10}).animate({
          'left': 0
        },this.defaults.speed);
        this.current_index++;
        this.current_index = this.current_index>=this.$lis.length ? 0 : this.current_index;
        this.$menus.eq(this.current_index).addClass('active').siblings().removeClass('active');
      }
    },

    //播放上一张
    movePrev: function(){
      if(!this.$lis.is(':animated')){
        this.prev_index = this.current_index - 1;
        this.prev_index = this.prev_index<0 ? this.$lis.length-1 : this.prev_index;
        this.$lis.eq(this.current_index).animate({
          'left': '100%'
        },this.defaults.speed);
        this.$lis.eq(this.prev_index).css({'left':'-100%','z-index':10}).animate({
          'left': 0
        },this.defaults.speed);
        this.current_index--;
        this.current_index = this.current_index<0 ? this.$lis.length-1 : this.current_index;
        this.$menus.eq(this.current_index).addClass('active').siblings().removeClass('active');
      }
    },

    //图片按钮点击事件
    moveTo: function(data_index){
      //alert($this+ "  " +data_index + " current_index="+this.current_index );
      if(!this.$lis.is(':animated')){
        if(data_index>this.current_index){
          this.next_index = data_index;
          this.$lis.eq(this.next_index).css({'left':'100%','z-index':10}).animate({
            'left':0
          },this.defaults.speed);
          this.$lis.eq(this.current_index).animate({
            'left':'-100%'
          },this.defaults.speed);
        }else if(data_index<this.current_index){
          this.prev_index = data_index;
          this.$lis.eq(this.prev_index).css({'left':'-100%','z-index':10}).animate({
            'left':0
          },this.defaults.speed);
          this.$lis.eq(this.current_index).animate({
            'left':'100%'
          },this.defaults.speed);
        }
        this.current_index = data_index;
        this.$menus.eq(this.current_index).addClass('active').siblings().removeClass('active');
      }
    },

    //是否自动播放
    autoplay: function(){
      var self = this;
      this.timer = window.setInterval(function(){
        self.moveNext();
      },this.defaults.delay);
    }
  };

  //初始化幻灯片控件(可以初始化多个幻灯片，而且互不干扰)
  Carousel.init = function(carousel){
    var _this_ = this;
    carousel.each(function(){
      new _this_($(this));
    });
  };

  window['Carousel'] = Carousel;

})(jQuery, window, document)