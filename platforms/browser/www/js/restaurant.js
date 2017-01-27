function loadRestaurant(id) {
    $.get("https://api.eet.nu/venues/" + id, function(res) {
        $("#restaurant").find('.name').html(res.name);
        for (var i = res.opening_hours.length - 1; i >= 0; i--) {
            hrs = res.opening_hours[i];
            if(hrs.closed) continue;
            if(typeof hrs.lunch_from != 'undefined') {
                var from = hrs.lunch_from;
                if(typeof hrs.lunch_till != 'undefined') {
                    from = from + ' - ' + hrs.lunch_till;
                }
                $("#restaurant").find('#opening .' + hrs.day).html(from);
            }
            if(typeof hrs.dinner_from != 'undefined') {
                var from = hrs.dinner_from;
                if(typeof hrs.dinner_till != 'undefined') {
                    from = from + ' - ' + hrs.dinner_till;
                }
                $("#restaurant").find('#opening .' + hrs.day + 'd').html(from);
            }
        }
        $(".btn.navigate").attr('onClick', 'navigate(' + res.geolocation.latitude + ',' + res.geolocation.longitude + ')');
        getReviews(id);
        printRating(res);
        $.mobile.changePage('#restaurant');
    });
}

function getReviews(id) {
    $.get("https://api.eet.nu/venues/" + id + "/reviews", function(res) {
        reviews = res.results;
        foodScore = categoryAverage(reviews, 'food');
        ambianceScore = categoryAverage(reviews, 'ambiance');
        serviceScore = categoryAverage(reviews, 'service');
        valueScore = categoryAverage(reviews, 'value');
        $('.numReviews').html(reviews.length);
        $('.foodScore').html(foodScore);
        $('.ambienceScore').html(ambianceScore);
        $('.serviceScore').html(serviceScore);
        $('.valueScore').html(valueScore);
    });
}

function navigate(lat, long) {
    console.log('navigating to ', lat, long);
    launchnavigator.navigate([lat, long], function(success){
        console.log('success', success);
    }, function(error){
        console.log('error', error);
    });
    console.log('done');
}

function categoryAverage(reviews, category) {
    var catTotal = 0;
    for (var i = reviews.length - 1; i >= 0; i--) {
        review = reviews[i];
        var score = review.scores[category];
        catTotal+=score;
    }

    return Math.round(catTotal / reviews.length);
}

function printRating(restaurant) {
    $('.genrating').empty();
    var i = 1;
    console.log('restaurant rating ', restaurant.rating);
    for (i; i <= (restaurant.rating - 20); i+=20) {
        console.log('printing star');
        $('.genrating').append('<i class="fa fa-star"></i>');
    }
    console.log('i ', i);
    if(restaurant.rating - i > 10) {
        $('.genrating').append('<i class="fa fa-star-half-empty"></i>');
    }
}