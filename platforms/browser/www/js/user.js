var user = {};
var userpos = null;
var loadingUser = false;

$( document ).on( "pageinit", function(event) {
    $('#login').on("touchend",function(e){
        email = $('#email-field').val();
        window.localStorage.setItem("email", email);
        $.mobile.loading('show');
        getUser(email);
    });
    if(!loadingUser) {
        getStoredUser(false);
    }
});

function getStoredUser(init) {
    email = window.localStorage.getItem("email");
    if(email == null) {
            $.mobile.changePage('#welcome');
    }
    if(init) {
        getUser(email);
    }
}

function getUser(email) {
    console.log('processing', email);
    loadingUser = true;
    $.get( "https://api.eet.nu/users?email=" + email, function(results) {
        if(results.results.length > 0) {
            user = results.results[0];
            $.mobile.loading('hide');
            $.mobile.changePage('#home');
            initHome();
        }else{
            if(email != null) {
                console.log('login fail');
                $('#user-not-found').show();
            }   
            $.mobile.loading('hide');
        };
        loadingUser = false;
    });
}

function getListAdded(uid, list, mostRecent, callback) {
    $.get("https://api.eet.nu/users/" + uid + "/" + list, function(results) {
        array = results.results;
        array.sort(function(a, b) {
            dateA = new Date(a.updated_at);
            dateB = new Date(b.updated_at);
            if(dateA > dateB) {
                return (mostRecent) ? -1 : 1;
            } else if (dateB < dateA) {
                return (mostRecent) ? 1 : -1;
            }
            return 0;
        });
        callback(array);
    });
}

function signOut() {
    window.localStorage.removeItem("email");
    user = {};
    $.mobile.changePage('#welcome');
}