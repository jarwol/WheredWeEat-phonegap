var app = {
    app : this,
    initialize : function () {
        var jqmReady = $.Deferred();
        var pgReady = $.Deferred();
        this.api = apiLocal;

        document.addEventListener('deviceready', function () {
            pgReady.resolve();
        }, false);
        $(document).on("pageinit", function () {
            jqmReady.resolve();
        });

        $.when(jqmReady, pgReady).then(function () {
            app.places = app.api.getPlaces();
            for (var id in app.places) {
                app.addPlaceListItem(app.places[id]);
            }
            navigator.contacts.find(["name"], app.retrievedContacts, app.logError, {multiple : true});

            $("#date").val(app.getToday());
        });
    },

    retrievedContacts : function (contacts) {
        this.contacts = contacts;
        for (var i = 0; i < this.contacts.length; i++) {
            $("#listFriends").append("<li><h1>" + this.contacts[i].displayName + "</h1><a data-icon='delete'></a></li>");
        }
    },

    addPlaceListItem : function (place) {
        $("#myPlaces").append(Handlebars.templates.placeListItem(place));
        $("#myPlaces").listview("refresh");
    },

    addPlace : function (place) {
        var id = this.api.insertPlace(place);
        this.places[id] = place;
        this.addPlaceListItem(place);
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