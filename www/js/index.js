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
            var places = localStorage.getItem("myPlaces");
            if (!places) {
                places = "";
                localStorage.setItem("myPlaces", JSON.stringify(places));
            }
            places = JSON.parse(places);
            for (var i = 0; i < places.length; i++) {
                app.addPlaceListItem(places[i]);
            }
        });
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
        $("#date").val("");
        $("#friends").text("");
        $.mobile.changePage("#main");
    }

};

app.initialize();