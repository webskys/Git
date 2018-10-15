marked.setOptions({
    headerIds:false
});
$(function () {
    $(document).ajaxStart(showLoading);
    $(document).ajaxStop(hideLoading);
    $.mdBook({
        sidebarFile: "sidebar.md"
    });
    showtop();
    $(window).on('scroll',showProgress);
    function showProgress() {
        var diffHeight = $('body').height()-$(window).height();
        var percent =  Math.max(0, Math.min(1, $(window).scrollTop() / diffHeight));
        $('#progress').css({height:percent* 100 + '%'})
    }
    $(window).on('scroll',showtop);
    $("#gotop").click(function(event){
        event.preventDefault();
        $('body,html').animate({scrollTop:0},200);
    });
    function showtop (){
        if($(this).scrollTop() > 200){
            $('#gotop').addClass('active')
        }else{
            $('#gotop').removeClass('active')
        }
    }
    function showLoading() {
        var el = $("#loading");
        if (el.length <= 0) {
            el = $("<div id='loading' class='loading'><div class='spinner'><div class='double1'></div><div class='double2'></div></div></div>")
            $('body').append(el)
        }
        el.css({"display":'block','opacity':'1'})
    }
    function hideLoading() {
        $("#loading").css({"display":'none','opacity':'0'})
    }
});