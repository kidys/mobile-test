function obMapBox(e) {
    var mapBox = {
        params: {
            map: false,
            zoomActive: false,
            zoomPoint: false,
            pointActive: false,
            placemark: false,
            icon: 'images/point-icon.svg',
            iconActive: '',
        },

        data: {
            ymap: '.points__list-item-ymap'
        },
        jsData: {
            department: {
                id: 'js-points-department-id',
                center: 'js-points-department-center',
                zoom: 'js-points-department-zoom',
            },
            zoom: {
                in: '',
                out: '',
            },
        },

        beforeInit: function (e) {
            if ($(e).attr('js-points-map') === 'true') return;

            this.container = $(e);
            this.ymap = this.container.find(this.data.ymap);
            $(this.ymap).attr('id', this.data.ymap.substr(1) + '-' + $(this.container).attr(this.jsData.department.id)); // Сделаем уникальный id для карты

            this.params.pointActive = $(this.container).attr(this.jsData.department.center).split(',');
            this.params.zoomActive = $(this.container).attr(this.jsData.department.zoom);

            this.init();
            this.container.attr('js-points-map', true);
        },

        init: function () {
            this.bindEvents();
            this.initYMap();
        },

        initYMap: function () {
            mapBox.params.map = new ymaps.Map($(mapBox.ymap).attr('id'), {
                center: mapBox.params.pointActive,
                zoom: mapBox.params.zoomActive,
                controls: [],
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
            });

            mapBox.params.map.setCenter(mapBox.params.pointActive, mapBox.params.zoomActive, {
                useMapMargin: 1
            });

            mapBox.initPlacemark(mapBox.params.pointActive);

            mapBox.params.map.container.fitToViewport();
        },

        initPlacemark: function (placemark) {
            ymaps.option.presetStorage.add('custom#default', {
                iconLayout: 'default#image',
                iconImageHref: mapBox.params.icon,
                iconImageSize: [43, 63],
                iconImageOffset: [-21.5, -63]
            });

            mapBox.params.placemark = new ymaps.Placemark([placemark[0], placemark[1]], '', {
                preset: 'custom#default'
            });

            mapBox.params.map.geoObjects.add(mapBox.params.placemark);
        },

        bindEvents: function () {

        },
    };

    mapBox.beforeInit(e);

    return mapBox;
}


(function () {
    let points = $('[js-points-item]'),
        pointsActiveClass = 'points__list-item--active',
        pointMapSwitcher = $('[js-points-map-switcher]');

    pointMapSwitcher.each(function (index) {
        $(this).on("click", function () {
            points.each(function() {
               $(this).removeClass(pointsActiveClass)
            });

            let point = $(this).parent(),
                pointMap = point.find('.points__list-item-map');

            point.addClass(pointsActiveClass);
            obMapBox(pointMap);
        });
    });
})();