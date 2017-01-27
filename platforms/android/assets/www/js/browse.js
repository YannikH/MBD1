resetBrowse(true);

$("#browse").on( "pagebeforeshow", function(event) {
    findNear();
});

function findNear() {
    if(restaurants == null) {
        $('.cards').hide();
        browse(function(){
            $.get("https://api.eet.nu/venues?max_distance=" + (options.distance * 1000) + "&geolocation=" + userpos.coords.latitude + "," + userpos.coords.longitude, function(res) {
                $('.loading').hide();
                restaurants = res.results;
                drawnRestaurantList = [];
                drawCard($('.card.one'));
                drawCard($('.card.two'));
                $('.cards').show();
                /*
                for (var i = restaurants.length - 1; i >= 0; i--) {
                    restaurant = restaurants[i];
                    $("#restaurant-debug-list").append(restaurant.name + ' <br/>');
                }
                */
            });
        });
    }
}

function resetBrowse(init) {
    restaurants = null;
    browseQueued = null;
    currentLiked = [];
    currentDisliked = [];
    drawnRestaurantList = [];
    if(!init) {
        console.log('dumping');
        window.localStorage.removeItem("current-liked");
        window.localStorage.removeItem("current-disliked");
    } else {
        console.log('restoring');
        restoredLiked = JSON.parse(window.localStorage.getItem("current-liked"));
        restoredDisliked = JSON.parse(window.localStorage.getItem("current-disliked"));
        if(restoredLiked != null) { currentLiked = restoredLiked; }
        if(restoredDisliked != null) { currentDisliked = restoredDisliked; }
    }
    drawList();
}

function browse(callback) {
    $.mobile.changePage('#browse');
    $('.cards').hide();
    $('.loading').show();
    if(userpos == null) {
        $(".loading h1").text('waiting for location');
        browseQueued = callback;
    }else{
        callback();
    }
}

function cards() {

}

function locationFound() {
    if(browseQueued != null) {
        browseQueued();
        browseQueued = null;
        $(".loading h1").text('Searching...');
    }
}

swipeStart = null;
cardStart = null;
swipeStep = null;
curPos = null;
steps = 0;

$('.card.one, .card.two').on('touchstart', function(event){
    card = $(event.target);
    if(!card.is('.card')) {
        card = card.closest('.card');
    }
    //console.log('touchdown', event);
    steps = 0;
    swipeStep = null;
    swipeStart = {x: event.originalEvent.touches[0].pageX, y: event.originalEvent.touches[0].pageY};
    cardStart = card.position();
});

$('.card.one, .card.two').on('vmousemove', function(event){
    card = $(event.target);
    if(!card.is('.card')) {
        card = card.closest('.card');
    }
    steps++;
    if(steps > 2) {
        swipeStep = {x: event.pageX, y: event.pageY};
        steps = 0;
    }
    curPos = {x: event.pageX, y: event.pageY};
    x = curPos.x - swipeStart.x;
    card.css({top: cardStart.y, left: x});

    tiltCard(card);
});

function tiltCard(card) {
    pos = card.position();
    centerX = pos.left + (card.width() / 2);
    viewSize = $( window ).width();
    screenPerc = (centerX / (viewSize)) - 0.5;
    maxTilt = 10;
    card.css({'transform': 'rotate(' + maxTilt*screenPerc + 'deg)'});
}

$('.card.one, .card.two').on('touchend',function(event) { 
    card = $(event.target);
    if(!card.is('.card')) {
        card = card.closest('.card');
    }
    if(swipeStep != null) {
        x = curPos.x - swipeStep.x;
        if(x < 5 && x > -5) {
        card.css({transform: 'none'});
            card.animate({top: cardStart.top, left: cardStart.left});
            console.log('done, slow, returning to start');
        } else {
            end = (x < 0) ? '-120%' : '120%';
            end = (x < 0) ? discard(card) : like(card);
            card.animate({top: cardStart.top, left: end}, 200, function(){
                one = $('.card.one');
                two = $('.card.two');
                two.removeClass('two'); two.addClass('one');
                one.removeClass('one'); one.addClass('two');
                one.css({top:'5%', left: '5%', transform:'none'});
                drawCard(one);
            });
            console.log('done, exiting to ', end);
        }
    } else {
        card.css({transform: 'none'});
        card.animate({top: cardStart.top, left: cardStart.left});
        console.log('done, short, returning to start');
    }
});

function drawCard(card) {
    var restaurant = restaurants.shift();
    console.log('drawing', restaurant);
    while(drawnRestaurant(restaurant.id)) {
        console.log('already drawn', restaurant.name);
        restaurant = restaurants.shift();
    }
    console.log('drawing2', restaurant);
    printRestaurant(card, restaurant);
    card.attr('id', restaurant.id);
    drawnRestaurantList.push(restaurant);
}

function printRestaurant(view, restaurant) {
    view.find('.name').html(restaurant.name);
    view.find('.tagline').html(restaurant.tagline);
    view.find('.category').html(restaurant.category);
    view.find('.score').html(restaurant.rating);

    view.find('.street').html(restaurant.address.street);
    view.find('.town').html(restaurant.address.city);
    console.log(restaurant.website_url);
    if(typeof restaurant.website_url != 'undefined' && restaurant.website_url != null) {
        view.find('.website').show();
        view.find('.website').attr('href', restaurant.website_url);
    } else {
        view.find('.website').hide();
    }
    if(typeof restaurant.telephone != 'undefined' && restaurant.telephone != null) {
        view.find('.phone').show();
        view.find('.phone').attr('href', 'tel:' + restaurant.telephone);
    } else {
        view.find('.phone').hide();
    }
}

function discard(target) {
    id = target.attr('id');
    currentDisliked.push(id);
    window.localStorage.setItem("current-disliked", JSON.stringify(currentDisliked));
}

function like(target) {
    id = target.attr('id');
    console.log('liking ', id);
    currentLiked.push(findRestaurant(id));
    window.localStorage.setItem("current-liked", JSON.stringify(currentLiked));
}

function findRestaurant(id) {
    for (var i = drawnRestaurantList.length - 1; i >= 0; i--) {
        var restaurant = drawnRestaurantList[i];
        if(restaurant.id == parseInt(id)) {
            console.log("SUCCEED", restaurant);
            return restaurant;
        }
    }
    return null;
}

function drawnRestaurant(id) {
    for (var i = currentLiked.length - 1; i >= 0; i--) {
        var restaurant = currentLiked[i];
        if(restaurant.id == parseInt(id)) {
            console.log("SUCCEED", restaurant);
            return true;
        }
    }
    for (var i = currentDisliked.length - 1; i >= 0; i--) {
        rid = currentDisliked[i];
        if(rid == parseInt(id)) {
            console.log("SUCCEED", restaurant);
            return true;
        }
    }
    return false;
}