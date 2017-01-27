$("#home").on( "pageshow", function(event) {
    initHome();
});

function initHome() {
    randomFav();
    $('.num-restaurants').html(currentLiked.length);
}

function randomFav() {
    $(".home-fav").hide();
    getListAdded(user.id, "favourites", true, function(items) {
        var item = items[Math.floor(Math.random()*items.length)];
        $(".home-fav").attr('onClick', 'loadRestaurant(' + item.id + ')');
        $(".home-fav .title").html(item.name);
        if(item.tagline != null) {
            console.log('tagline', item);
            $(".home-fav .tagline").html(item.tagline);
        } else {
            console.log('no tagline');
            date = item.updated_at.split('T')[0];
            $(".home-fav .tagline").html('Your favourite since ' + date);
        }
        $(".home-fav").show();
    });
}

$("#search").on("touchend", function() {
    $.mobile.changePage('#browse');
});