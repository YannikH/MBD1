function openList() {
    $.mobile.changePage('#list');
}

$("#list").on( "pageshow", function(event) {
    console.log('init list');
    drawList();
});

function drawList() {
    $("#list .restaurantList").empty();
    currentLiked.forEach(function(restaurant) {
        console.log('drawing restaurant');
        restaurantView = $('<div onClick="loadRestaurant(' + restaurant.id + ')" hidden><div class="padding-sides"><h2></h2><p></p></div><hr></div>');
        console.log(restaurantView);

        restaurantView.find('h2').html(restaurant.name);
        restaurantView.find('p').html(restaurant.tagline);
        $("#list .restaurantList").append(restaurantView);
        restaurantView.show();
    });
}