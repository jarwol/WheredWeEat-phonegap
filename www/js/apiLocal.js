var apiLocal = (function () {
    var KEY_PLACES = "myPlaces";
    var KEY_NEXTID = "nextId";

    return {
        getNextId : function () {
            var id = localStorage.getItem(KEY_NEXTID);
            if (!id) id = 1;
            id = parseInt(id);
            localStorage.setItem(KEY_NEXTID, id + 1);
            return id;
        },

        getPlaces : function () {
            var placesStr = localStorage.getItem(KEY_PLACES);
            var places;
            if (!placesStr) {
                places = {};
                localStorage.setItem(KEY_PLACES, JSON.stringify(places));
            }
            else {
                places = JSON.parse(placesStr);
            }
            return places;
        },

        insertPlace : function (place) {
            var places = this.getPlaces();
            place.id = this.getNextId();
            places[place.id] = place;
            localStorage.setItem(KEY_PLACES, JSON.stringify(places));
            return place.id;
        },

        deletePlace : function (id) {
            var places = this.getPlaces();
            if (places[id]) {
                delete places[id];
                localStorage.setItem(KEY_PLACES, JSON.stringify(places));
                return true;
            }
            return false;
        }
    };
})();