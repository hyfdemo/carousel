if (window.jQuery === undefined) { 
    throw new Error('carousel插件库依赖jQuery'); 
}

jQuery.fn.carousel = function (imgs, interval, wait) {
    var timer = null,
        current = 0,    // 当前图片的索引  
        $parent = $(this),
        INTERVAL = interval || 500, // 动画时间间隔
        WAIT = wait || 2000,        // 自动移动的等待时间
        LIWIDTH = parseFloat($parent.css('width'));

    if (INTERVAL > WAIT * 0.8) {
        throw new Error('carousel插件: 动画时间间隔不能大于动画等待时间 * 0.8');
    }

    if(parseFloat($parent.css('height')) <= 0) {
        throw new Error('carousel插件: 轮播图父容器的高度不能为0');
    }

    $parent.attr('data-trigger', 'carousel')
           .append($('<ul id="imgs">'))
           .append($('<ul id="indexs">'));
    var $imgs = $parent.children('ul:first-child'),
        $indexs = $imgs.next('ul');
        
    for (var i = 0, lis = '', idxs = ''; i < imgs.length; i++) {
        lis += `<li><img src="${imgs[i]}"></li>`; // 准备侵入所有图片和索引
        idxs += '<li></li>';
    }
    lis += `<li><img src="${imgs[0]}"></li>`;     // 添加第一张图副本
    $imgs.html(lis).css('width', LIWIDTH * (imgs.length + 1)) // 入侵图片
         .next('#indexs').html(idxs)                          // 入侵索引
         .children('li:first-child').addClass('hover');       // 入侵完毕
    $imgs.children('li').css('width', LIWIDTH);               // 为每张图片设置宽度

    function move(index, repeat) {
        clearTimeout(timer); // 先停止动画
        $indexs.children(`li:nth-child(${index % imgs.length + 1})`)
               .addClass('hover').siblings('li').removeClass('hover');  // 更改索引的样式
        $imgs.stop(true).animate({left: -LIWIDTH * index}, INTERVAL, () => { 
            if ((current = index) === imgs.length) { // 如果移动到第一幅图的副本时
                current = 0;          // 把当前图片索引置为0
                $imgs.css('left', 0); // 把图片组的位置还原
            }                 
        });
        repeat && autoMove();    // 先判断是否要重启滚动动画
    }
    function autoMove() {
        timer = setTimeout(() => move(++current, true), WAIT); // 自动动画
    }

    $indexs.on("mouseenter", "li", (e) => {        // 监听鼠标进入事件
            move($("#indexs>li").index(e.target)); // 移动到鼠标悬停索引的图片
        }).on('mouseleave', 'li', () => { autoMove(); }); // 当鼠标移出时重启自动轮播

    autoMove();
}
