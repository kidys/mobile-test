var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

function destroyOwlCarousel() {
    const $stocks = $('.stocks').find('.stocks__list');
    const $popularProducts = $('.popular').find('.product-list');
    const el = $stocks.find('.stocks__btn').empty();

    if ($(window).width() > 767) {
        $('.popular__btn-more .button').html('Перейти в каталог');

        $stocks.trigger('destroy.owl.carousel');
        if (!el.length) {
            $stocks.append('<div class="stocks__btn mobile mobile--hidden">Все акции</div>');
        }

        $popularProducts.find('.product-list__item').each(function () {
            const image = $(this).find('.product-list__item-image img').data('image');
            $(this).find('.product-list__item-image img').attr('src', image);
        });
        $popularProducts.owlCarousel({
            responsiveClass: true,
            //autoWidth: true,
            autoHeight: true,
            navText: [
                '<img src="images/b-popular__icon-arrow-left.svg" alt="popular left arrow">',
                '<img src="images/b-popular__icon-arrow-right.svg" alt="popular right arrow">'
            ],
            responsive: {
                768: {
                    items: 3,
                    nav: true,
                    loop: true
                },
                1280: {
                    items: 4,
                    nav: true,
                    loop: true
                }
            }
        });

        if ($(window).width() < 1265) {
            $stocks.find('.stocks__item').each(function () {
                const data = $(this).data('image-tablet');
                $(this).css('background-image', 'url("' + data + '")');
                $stocks.find('.stocks__btn').html('<span>Все акции</span><span>%</span>');
            });
        } else if ($(window).width() >= 1265) {
            $stocks.find('.stocks__item').each(function () {
                const data = $(this).data('image-desktop');
                $(this).css('background-image', 'url("' + data + '")');
            });
        }
    } else {
        const $bottomMenu = $('.bottom-menu__item');
        $bottomMenu.each(function () {
            const menuTitle = $(this).find('.bottom-menu__item-title h3');
            menuTitle.parent().addClass('bottom-menu__item-title--mobile-arrow');

            $(this).find('.bottom-menu__item-content-menu').hide();
            menuTitle.on('click', function () {
                $(this).parent().parent().find('.bottom-menu__item-content-menu').slideToggle();
                $(this).parent().toggleClass('bottom-menu__item-title--mobile-arrow-up');
            });
        });

        $('.popular__btn-more .button').html('Каталог');
        $popularProducts.find('.product-list__item').each(function (i, el) {
            if (i < 3) {
                const image = $(this).find('.product-list__item-image img').data('image');
                $(this).find('.product-list__item-image img').attr('src', image);
            }
        });
        $popularProducts.trigger('destroy.owl.carousel');


        if (el.length) {
            $stocks.find('.stocks__btn').remove();
        }

        if ($stocks.find('.owl-dots')) {
            $stocks.find('.owl-dots').remove();
        }

        $stocks.find('.stocks__item').each(function () {
            $(this).css('background-image', 'none');
        });

        $stocks.find('.owl-nav .owl-prev').html('<img src="images/b-stock__icon-arrow-left.svg" alt="stock left arrow">');
        $stocks.find('.owl-nav .owl-next').html('<img src="images/b-stock__icon-arrow-right.svg" alt="stock right arrow">');
    }
}

function setPriceProduct($el, $minimumQuantityStock, $valueCalc, $priceDefault, $currentPrice) {
    if ($el.find('.price .price__value')) {
        const $priceCurrent = $el.find('.price .price__value');
        const $priceOld = $el.find('.price .price__value--old');

        if (($minimumQuantityStock !== 0) && $valueCalc >= $minimumQuantityStock) {
            $el.find('.catalog-product__price-item.catalog-product__price-item--info').css('display', 'block');
            $priceOld.css('display', 'flex');
        } else {
            $el.find('.catalog-product__price-item.catalog-product__price-item--info').css('display', 'none');
            $priceOld.css('display', 'none');
        }

        $priceCurrent.html($currentPrice);
        $priceOld.html(`<span>${$priceDefault}</span>`);
    }
}

function setValuesProduct($parent, $type = 1, $thisValue = 0) {
    let $minimumQuantity = parseFloat($parent.data('minimum-quantity')) || 1;
    $minimumQuantity = (!$minimumQuantity) ? 1 : $minimumQuantity;
    let $minimumQuantityStock = parseFloat($parent.data('minimum-quantity-stock')) || 0;
    $minimumQuantityStock = (!$minimumQuantityStock) ? 0 : $minimumQuantityStock;

    let $priceDefault = parseFloat($parent.data('price-default')) || 1;
    $priceDefault = (!$priceDefault) ? 1 : $priceDefault;
    let $priceStock = parseFloat($parent.data('price-stock')) || 0;
    $priceStock = (!$priceStock) ? 0 : $priceStock;

    let $value = parseFloat($parent.find('.count > *').html()) || 1;
    $value = (!$value) ? $minimumQuantity : $value;
    let $valueCalc = 0;

    if (parseInt($type) == 1 || parseInt($type) == 2) {
        $valueCalc = (parseInt($type) === 1) ? (($value - $minimumQuantity) <= $minimumQuantity) ? $minimumQuantity : $value - $minimumQuantity : $value + $minimumQuantity;
    } else {
        $valueCalc = parseFloat($thisValue) ? parseFloat($thisValue) : $minimumQuantity;
        const countCalc = parseInt($valueCalc/$minimumQuantity) ? parseInt($valueCalc/$minimumQuantity) : 1;

        $valueCalc = $minimumQuantity * countCalc;
    }

    if ($valueCalc < 0) {
        $valueCalc = $valueCalc * -1;
    }

    if ($valueCalc === $minimumQuantity) {
        $parent.find('.minus').addClass('minus--disabled');
    } else {
        $parent.find('.minus').removeClass('minus--disabled');
    }

    $parent.find('.count > *').html($valueCalc);

    let $currentPrice = (($minimumQuantityStock !== 0) && $valueCalc >= $minimumQuantityStock) ? (!$priceStock) ? $priceDefault : $priceStock : $priceDefault;
    $parent.parent().parent().find('.product-list__item-price').html(`${$currentPrice}&nbsp;₽`);

    setPriceProduct($parent.parent().parent().parent(), $minimumQuantityStock, $valueCalc, $priceDefault, $currentPrice);

    return {
        minimumQuantity: $minimumQuantity,
        minimumQuantityStock: $minimumQuantityStock,
        priceDefault: $priceDefault,
        priceStock: $priceStock,
        value: $value,
        valueCalc: $valueCalc,
        currentPrice: $currentPrice
    };
}

function setElements() {
    $('.product-list__item-actions-count, .catalog-product__actions-count').each(function () {
        let $minimumQuantity = parseFloat($(this).data('minimum-quantity')) || 1;
        $minimumQuantity = (!$minimumQuantity) ? 1 : $minimumQuantity;
        let $minimumQuantityStock = parseFloat($(this).data('minimum-quantity-stock')) || 0;
        $minimumQuantityStock = (!$minimumQuantityStock) ? 0 : $minimumQuantityStock;
        let $value = parseFloat($(this).find('.count > *').html());
        //$value = (!$value) ? ((!$minimumQuantityStock) ? $minimumQuantity : 1) : $value;

        //console.log($minimumQuantity, $value);

        if ($minimumQuantity >= $value) {
            $(this).find('.minus').addClass('minus--disabled');
        }

        $(this).find('.count').on('click', function () {
            const $value = $(this).find('span').html() ? $(this).find('span').html() : 1;

            if ($value) {
                $(this).html(`<input type="text" value="${$value}"/>`);
                const $input = $(this).find('input[type="text"]');
                $input.focus();
                $input.select();
                $input.on('keyup', function (event) {
                    if (event.keyCode == 13) {
                        $(this).blur();
                    }
                });
                $input.on('blur', function () {
                    const $inputValue = parseFloat($input.val()) ? parseFloat($input.val()) : parseFloat($input.parent().parent().data('minimum-quantity'));
                    const $data = setValuesProduct($input.parent().parent(), 3, $inputValue);

                    $(this).parent().html(`<span>${$data.valueCalc}</span>`);
                });
                $input.on('change', function () {
                    let $minimumQuantity = parseFloat($(this).parent().parent().data('minimum-quantity')) || 1;
                    if (parseFloat($(this).val()) <= $minimumQuantity) {
                        $(this).parent().parent().find('.minus').addClass('minus--disabled');
                    } else {
                        $(this).parent().parent().find('.minus').removeClass('minus--disabled');
                    }

                    if (!parseFloat($(this).val())) {
                        $(this).val(1);
                    }
                });
            }
        });

        $(this).find('.minus').on('click', function () {
            let $parent = $(this).parent();
            const $data = setValuesProduct($parent, 1);
        });
        $(this).find('.plus').on('click', function () {
            let $parent = $(this).parent();
            const $data = setValuesProduct($parent, 2);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    setElements();

    $('.select-component select').selectric({
        arrowButtonMarkup: '<span class="btn"><img src="images/selecet-chevron.svg" alt="icon"/></span>',
    });

    const burger = document.querySelector('.header .burger');
    if (burger) {
        burger.addEventListener('click', function (event) {
            event.currentTarget.classList.toggle('burger--opened');

            if ($(burger).hasClass('burger--opened')) {
                $('body').css('overflow', 'hidden');
                $('.top-navigation').removeClass('slideOutRight');
                $('.top-navigation').addClass('slideInRight').addClass('animated--end');
            } else {
                $('body').css('overflow', 'auto');
                $('.top-navigation').removeClass('slideInRight');
                $('.top-navigation').addClass('slideOutRight');
            }
        }, false);

        $('.top-navigation').on('animationend', function () {
            if ($(burger).hasClass('burger--opened')) {
                //$('.top-navigation').removeClass('mobile--hidden').addClass('mobile--visible');
                $('.top-navigation').addClass('animated--end');
                $('.header .burger').addClass('burger--isOpen');
            } else {
                //$('.top-navigation').removeClass('mobile--visible').addClass('mobile--hidden');
                $('.top-navigation').removeClass('animated--end');
                $('.header .burger').removeClass('burger--isOpen');
            }
        });
    }

    $('.reviews .owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        responsiveClass: true,
        autoHeight: true,
        responsive: {
            0: {
                items: 2,
                nav: false,
                loop: true
            },
            768: {
                items: 3,
                nav: false,
                loop: true
            },
            1280: {
                items: 4,
                nav: false,
                loop: true
            }
        }
    });

    $('.stocks .owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        responsiveClass: true,
        autoHeight: true,
        responsive: {
            0: {
                items: 1,
                nav: true,
                loop: true
            }
        }
    });
    $(window).resize(function () {
        destroyOwlCarousel();
    });
    destroyOwlCarousel();
});

$(document).ready(function () {
    (function () {
        var $map = $('#map-contacts');

        if (!$map.length) return;

        function loadMap() {
            $.getScript('//api-maps.yandex.ru/2.1/?lang=ru', function () {
                ymaps.ready(function () {
                    initialize();
                });
            });
        }

        let callback = function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.intersectionRatio > 0) {
                    observer.unobserve(entry.target);
                    loadMap();
                }
            });
        };

        if (!('IntersectionObserver' in window)) {
            loadMap();
        } else {
            let config = {
                rootMargin: '500px 0px',
                threshold: 0
            };

            let observer = new IntersectionObserver(callback, config);
            observer.observe($map[0]);
        }

        function initialize() {
            if (typeof contactsMarker == "object") {
                let placemark = contactsMarker.location,
                    zoom = 16,
                    behaviors = ['drag', 'dblClickZoom', 'multiTouch', 'zoom'],
                    map = new ymaps.Map('map-contacts', {
                        behaviors: behaviors,
                        center: placemark,
                        controls: [],
                        zoom: zoom
                    });

                map.controls.add('zoomControl', {
                    size: "small",
                    position: {
                        bottom: 45,
                        right: 15
                    }
                });

                if (isMobile.any()) {
                    map.behaviors.disable('drag');
                }

                let marker = {
                    preset: "islands#icon"
                };

                map.geoObjects.add(new ymaps.Placemark(placemark, {}, marker));
            }
        }
    })();

    (function () {
        let catalogMenu = $('.catalog-menu'),
            catalogMenuSwitcher = catalogMenu.find('.catalog-menu__switcher'),
            catalogMenuBurger = catalogMenuSwitcher.find('.burger');

        catalogMenuSwitcher.on('click', function () {
            catalogMenuBurger.toggleClass('burger--opened');
            catalogMenu.toggleClass('catalog-menu--opened');
        });

    })();

    (function () {
        let $slider = $('.product-list--slider-other');
        $slider.find('.product-list__item').each(function () {
            const image = $(this).find('.product-list__item-image img').data('image');
            $(this).find('.product-list__item-image img').attr('src', image);
        });
        $slider.owlCarousel({
            responsiveClass: true,
            autoHeight: true,
            loop: true,
            nav: true,
            navText: [
                '<img src="images/b-popular__icon-arrow-left.svg" alt="popular left arrow">',
                '<img src="images/b-popular__icon-arrow-right.svg" alt="popular right arrow">'
            ],
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 3
                },
                1280: {
                    items: 4
                }
            }
        });
    })();

    (function () {
        let spoiler = $('.spoiler-container'),
            spoilerControl = spoiler.find('.spoiler-container__control'),
            spoilerMoreText = spoilerControl.data('more'),
            spoilerHideText = spoilerControl.data('hide');

        spoilerControl.find('span').text(spoilerMoreText);

        spoilerControl.on('click', function () {
            spoiler.toggleClass('spoiler-container--opened');
            if(spoiler.hasClass('spoiler-container--opened')) {
                spoilerControl.find('span').text(spoilerHideText);
            } else {
                spoilerControl.find('span').text(spoilerMoreText);
            }
        });

    })();

    (function () {
        let sanitationTabs = $('.sanitation__tabs'),
            sanitationTabsItem = sanitationTabs.find('.sanitation__tabs-item'),
            activeTab = 'sanitation__tabs-item--active',
            sanitationSections = $('.sanitation'),
            sanitationSection = $('.sanitation__section'),
            activeSection = 'sanitation__section--active';

        sanitationTabsItem.on('click', function () {
                if(!$(this).hasClass(activeTab)) {
                    $(this).addClass(activeTab).siblings().removeClass(activeTab)
                        .closest(sanitationSections).find(sanitationSection).removeClass(activeSection).eq($(this).index()).addClass(activeSection);
                }
            });
    })();

    (function () {
        let lkOrder = $('.lk__order'),
            lkOrderSwitcher = lkOrder.find('.lk__order-header'),
            activeClass = 'lk__order--active';

        lkOrderSwitcher.on('click', function () {
                $(this).parent().toggleClass(activeClass);
            });
    })();

    (function () {
        let pageBody = $('body'),
            pageBodyActiveClass = 'body--modal-active',
            lkAuthSwitcher = $('[data-name="user account"], .lk-authentication__close, .lk-logout__close'),
            lkAuth = $('.lk-authentication'),
            lkAuthActiveClass = 'lk-authentication--active',
            lkLogout = $('.lk-logout'),
            lkLogoutActiveClass = 'lk-logout--active';

        lkAuthSwitcher.on('click', function () {
            var status = $(this).data('status');

            if(status === 'is-authorized') {
                toggleLogoutModal();
            } else {
                toggleAuthModal();
            }
        });

        function toggleLogoutModal() {
            pageBody.toggleClass(pageBodyActiveClass);
            lkLogout.toggleClass(lkLogoutActiveClass);
        }

        function toggleAuthModal() {
            pageBody.toggleClass(pageBodyActiveClass);
            lkAuth.toggleClass(lkAuthActiveClass);
        }
    })();

    (function () {
        let pageBody = $('body'),
            pageBodyActiveClass = 'body--modal-active',
            selectCitySwitcher = $('[data-action="select-city"], .select-city__close'),
            selectedCitySwitcher = $('[data-action="close-selected-city"]'),
            selectCity = $('.select-city'),
            selectedCity = $('.selected-city'),
            selectCityActiveClass = 'select-city--active',
            selectedCityActiveClass = 'selected-city--active';

        selectCitySwitcher.on('click', function () {
            toggleSelectCityModal();
        });

        selectedCitySwitcher.on('click', function () {
            selectedCity.removeClass(selectedCityActiveClass);
        });

        function toggleSelectCityModal() {
            if($(window).width() < 768) {
                pageBody.toggleClass(pageBodyActiveClass);
            }
            if(selectedCity.hasClass(selectedCityActiveClass)) {
                selectedCity.removeClass(selectedCityActiveClass);
            }
            selectCity.toggleClass(selectCityActiveClass);
        }
    })();

    (function () {
        let pageBody = $('body'),
            pageBodyActiveClass = 'body--modal-active',
            popupActiveClass = 'popup--active',
            popupSwitcher = $('[js-popup-switcher]'),
            popupBlock = $('[js-popup]');

        popupSwitcher.on('click', function () {
            togglePopup(popupSwitcher.attr('js-popup-switcher'));
        });

        function togglePopup(popup) {
            pageBody.toggleClass(pageBodyActiveClass);
            if(popupBlock.attr('js-popup') === popup) {
                popupBlock.toggleClass(popupActiveClass)
            }
        }
    })();

    (function () {
        let $slider = $('.documents--slider');
        $slider.owlCarousel({
            responsiveClass: true,
            autoHeight: true,
            loop: true,
            nav: true,
            navText: [
                '<img src="images/chevron-left.svg" alt="">',
                '<img src="images/chevron-right.svg" alt="">'
            ],
            responsive: {
                0: {
                    items: 2
                },
                768: {
                    items: 4
                },
                1280: {
                    items: 7
                }
            }
        });
    })();
});


$(window).on('load resize', function () {
    (function () {
        let wWidth = $(window).width(),
            orderTabs = $('.shopping-cart__order-tabs'),
            orderTabsItem = orderTabs.find('.shopping-cart__order-tab'),
            activeTab = 'shopping-cart__order-tab--active',
            orderSteps = $('.shopping-cart__order'),
            orderStep = $('.shopping-cart__order-step'),
            orderStepButton = orderStep.find('.shopping-cart__order-button'),
            activeStep = 'shopping-cart__order-step--active';

        if (wWidth < 768) {
            orderTabsItem.on('click', function () {
                setActiveTab($(this));
            });
            orderStepButton.on('click', function () {
                let stepButtonValue = '.' + $(this).data('step'),
                    targetStep = orderSteps.find(stepButtonValue);

                setActiveStep(targetStep);
            });
        } else {
            orderStep.on('click', function () {
                setActiveStep($(this));
            });
        }

        function setActiveTab(tab) {
            if(!tab.hasClass(activeTab)) {
                tab.addClass(activeTab).siblings().removeClass(activeTab)
                    .closest(orderSteps).find(orderStep).removeClass(activeStep).eq(tab.index()).addClass(activeStep);
            }
        }

        function setActiveStep(step) {
            if(!step.hasClass(activeStep)) {
                step.addClass(activeStep).siblings().removeClass(activeStep)
                    .closest(orderTabs).find(orderTabsItem).removeClass(activeTab).eq(step.index() - 1).addClass(activeTab)
            }
        }
    })();



    (function () {
        let wWidth = $(window).width(),
            slider = $('.sanitation__section .sanitation__items'),
            sliderClass = 'sanitation__items--slider';

        if (wWidth < 768) {

            if(!slider.hasClass(sliderClass)) {
                slider.addClass(sliderClass)
            }

            slider.owlCarousel({
                responsiveClass: true,
                autoHeight: true,
                loop: true,
                nav: true,
                navText: [
                    '<img src="images/b-popular__icon-arrow-left.svg" alt="popular left arrow">',
                    '<img src="images/b-popular__icon-arrow-right.svg" alt="popular right arrow">'
                ],
                responsive: {
                    0: {
                        items: 1
                    },
                    768: {
                        items: 3
                    },
                    1280: {
                        items: 4
                    }
                }
            });
        } else {
            slider.trigger('destroy.owl.carousel');
            slider.removeClass(sliderClass);
        }
    })();
});