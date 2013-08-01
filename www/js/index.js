var app = {
    app : this,
    initialize : function () {
        var jqmReady = $.Deferred();
        var pgReady = $.Deferred();

        document.addEventListener('deviceready', function () {
            pgReady.resolve();
        }, false);
        $(document).on("pageinit", function () {
            jqmReady.resolve();
        });

        $.when(jqmReady, pgReady).then(function () {
            var places;
            var placesStr = localStorage.getItem("myPlaces");
            if (!placesStr || !((places = JSON.parse(placesStr)) instanceof Array)) {
                places = [];
                localStorage.setItem("myPlaces", JSON.stringify(places));
            }
            for (var i = 0; i < places.length; i++) {
                app.addPlaceListItem(places[i]);
            }

            navigator.contacts.find(["name"], app.retrievedContacts, app.logError, {multiple : true});

            $("#date").val(app.getToday());
        });
    },

    retrievedContacts : function (contacts) {
        this.contacts = contacts;
    },
    
    addFriend : function(contact){
        $("#listFriends").append("<li><h1>" + contact.name + "</h1><a data-icon='delete'></a></li>");
    },

    addPlaceListItem : function (place) {
        var list = document.getElementById("myPlaces");
        var li = document.createElement("li");
        list.appendChild(li);
        li.outerHTML = Handlebars.templates.placeListItem(place);
        $("#myPlaces").listview("refresh");

    },

    addPlace : function (place) {
        var places = JSON.parse(localStorage.getItem("myPlaces"));
        places.push(place);
        this.addPlaceListItem(place);
        localStorage.setItem("myPlaces", JSON.stringify(places));
    },

    submitPlaceForm : function () {
        var place = {
            name : $("#placeName").val(),
            date : $("#date").val(),
            friends : $("#friends").val()
        };
        if (place.name) {
            this.addPlace(place);
            $.mobile.changePage("#main");
        }
        else {
            navigator.notification.alert("Name cannot be blank", null, "Invalid name", "Ok");
        }
    },

    clearPlaceForm : function () {
        $("#placeName").val("");
        $("#date").val(app.getToday());
        $("#friends").text("");
        $.mobile.changePage("#main");
    },


    /****************************
     * Util
     ****************************/
    getToday : function () {
        var d = new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        return d.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
    },

    logError : function (err) {
        console.log(err);
    }
};

app.initialize();