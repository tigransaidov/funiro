const iconMenu = document.querySelector('.icon-menu');
const menuBody = document.querySelector('.menu__body');

iconMenu.addEventListener('click', function() {
    if (window.innerWidth <= 768) {
        iconMenu.classList.toggle('_active');
        menuBody.classList.toggle('_active');
    }
})
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"

"use strict";

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    const popupSubMg = document.querySelector('.popup-subscribe-message');
    const popupClose = document.querySelector('.popup__close');
    form.addEventListener('submit', formSend);
    popupClose.addEventListener('click', removeMessage);

    async function formSend(e) {
        e.preventDefault();

        let error = formValidate(form);
    }

    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req');

        for (let i = 0; i < formReq.length; i++) {
            const input = formReq[i];
            formRemoveError(input);

            if (input.classList.contains('_email')) {
                if (!emailTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else if (input.getAttribute('type') === 'checkbox' && input.checked === false) {
                formAddError(input);
                error++;
            } else {
                if (input.value === '') {
                    formAddError(input);
                    error++;
                } 
            }
        }
        displayMessage(error);
    }

    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }
    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }

    function emailTest(input) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(input.value);
    } 
    function displayMessage(error, time = 4000) {
        if (error === 0) {
            popupSubMg.classList.add('_open');
            const delay = setTimeout(function () {
                removeMessage();
                return () => clearTimeout(delay);
            }, time);
        }
    }
    function removeMessage() {
        popupSubMg.classList.remove('_open');
    }
})
// function isMobileDevice() {
//     var check = false;
//     (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
//     return check;
// };

function is_touch_enabled() {
    return ( 'ontouchstart' in window ) || 
           ( navigator.maxTouchPoints > 0 ) || 
           ( navigator.msMaxTouchPoints > 0 );
}

function removeClasses(targets, classToDelete) {
    for (let i = 0; i < targets.length; i++) {
        target = targets[i];
        target.classList.remove(classToDelete);
    }
}

function ibg() {
    let ibg = document.querySelectorAll("._ibg");
    for (var i = 0; i < ibg.length; i++) {
        if(ibg[i].querySelector('img')) {
            ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
        }
    }
}

ibg();
lightGallery(document.getElementById('gallery'), {
        selector: '.row-gallery__item'
});
window.onload = function () {
    document.addEventListener('click', documentActions);

    // Actions
    function documentActions(e) {
        const targetElement = e.target;
        /* Only for mobile devices with length more than 768px, control sub-navs */ 
        if (window.innerWidth > 768 && !is_touch_enabled()) {
            if (targetElement.classList.contains('menu__arrow')) {
                targetElement.closest('.menu__item').classList.toggle('_hover');
            }
            if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
                removeClasses(document.querySelectorAll('.menu__item._hover'), '_hover');
            }
        } 
        /* Header Search Form */ 
        if (targetElement.classList.contains('search-form__icon')) {
            document.querySelector('.search-form').classList.toggle('_active');
        } else if (!targetElement.closest('.search-form') && document.querySelector('.search-form._active')) {
            removeClasses(document.querySelectorAll('.search-form._active'), '_active');
        }
        // More Button
        if (targetElement.classList.contains('products__more')) {
            if (targetElement.classList.contains('_less')) {
                showLess(targetElement);
            } else {
                getProducts(targetElement);
            }
            e.preventDefault();
        }
        // Add to Cart Button
        if (targetElement.classList.contains('actions-product__button')) {
            const productId = targetElement.closest('.item-product').dataset.pid;
            addToCart(targetElement, productId);
            e.preventDefault();
        }
        // Click on Cart 
        if (targetElement.classList.contains('cart-header__icon') || targetElement.closest('cart-header__icon')) {
            if (document.querySelector('.cart-list').children.length > 0) {
                document.querySelector('.cart-header').classList.toggle('_active');
            }
            e.preventDefault();
        } else if (!targetElement.closest('.cart-header') && !targetElement.classList.contains('actions-product__button')) {
            document.querySelector('.cart-header').classList.remove('_active');
        }
        // Click on Delete 
        if (targetElement.classList.contains('cart-list__delete') || targetElement.closest('.cart-list__delete')) {
            const productId = targetElement.closest('.cart-list__item').dataset.cartPid; 
            updateCart(targetElement, productId, false);
            e.preventDefault();
        }
    }

    // Header
    const headerElement = document.querySelector('.header');
    
    const callback = function (entries, observer) {
        if (entries[0].isIntersecting) {
            headerElement.classList.remove('_scroll');
        } else {
            headerElement.classList.add('_scroll');
        }
    };

    const headerObserver = new IntersectionObserver(callback);
    headerObserver.observe(headerElement);

    // Load more products
    async function getProducts(button) {
        button.classList.add('_hold');
        const file = 'json/products.json';
        let response = await fetch(file, {
            method="GET"
        });
        if (response.ok) {
            let result = await response.json();
            loadProducts(result);
            ibg();
            button.classList.remove('_hold');
            button.classList.add('_less');
            button.innerHTML = 'Show less'
            // button.remove();
        } else {
            alert('Error');
        }
    }
    // Less
    function showLess(button) {
        button.classList.add('_hold');
        const productsItem = document.querySelectorAll('.products__item');
        for (let i = 0; i < productsItem.length; i++) {
            const item = productsItem[i];
            if (item.getAttribute('data-pid') > 4) {
                item.remove();
            }
        }
        button.innerHTML = 'Show more'
        button.classList.remove('_less');
        button.classList.remove('_hold');
    }

    function loadProducts(data) {
        const productsItems = document.querySelector('.products__items');
        data.products.forEach(item => {
            const productId = item.id;
            const productUrl = item.url;
            const productImage = item.image;
            const productTitle = item.title;
            const productText = item.text;
            const productPrice = item.price;
            const productOldPrice = item.priceOld;
            const productShareUrl = item.shareUrl;
            const productLikeUrl = item.likeUrl;
            const productLabels = item.labels;

            let productTemplateStart = `<article data-pid="${productId}" class="products__item item-product">`;
            let productTemplateEnd = "<article>";

            let productTemplateLabels = '';
            if (productLabels) {
                let productTemplateLabelsStart = '<div class="item-product__labels">';
                let productTemplateLabelsEnd = '</div>';
                let productTemplateLabelsContent = '';

                productLabels.forEach(labelItem => {
                    productTemplateLabelsContent += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`;
                })  


                productTemplateLabels += productTemplateLabelsStart;
                productTemplateLabels += productTemplateLabelsContent;
                productTemplateLabels += productTemplateLabelsEnd;
            }
            
            let productTemplateImage = `
                <a href="${productUrl}" class="item-product__image _ibg">
                    <img src="img/products/${productImage}" alt="${productTitle}">
                </a>
            `;

            let productTemplateBodyStart = '<div class="item-product__body">';
            let productTemplateBodyEnd = '</div>';

            let productTemplateContent = `
                <div class="item-product__content">
                    <h3 class="item-product__title">${productTitle}</h3>
                    <div class="item-product__text">${productText}</div>
                </div>
            `;

            let productTemplatePrices = '';
            let productTemplatePricesStart = '<div class="item-product__prices">';
            let productTemplatePricesCurrent = `<div class="item-product__price item-product__price">Rp ${productPrice}</div>`;
            let productTemplatePricesOld = `<div class="item-product__price item-product__price_old">Rp ${productOldPrice}</div>`;
            let productTemplatePricesEnd = '</div>';

            productTemplatePrices = productTemplatePricesStart;
            productTemplatePrices += productTemplatePricesCurrent;
            if (productOldPrice) {
                productTemplatePrices += productTemplatePricesOld;
            }
            productTemplatePrices += productTemplatePricesEnd;

            let productTemplateActions = `
                <div class="item-product__actions actions-product">
                    <div class="actions-product__body">
                        <a href="#" class="actions-product__button btn btn_white">Add to cart</a>
                        <a href="${productShareUrl}" class="actions-product__link _icon-share">Share</a>
                        <a href="${productLikeUrl}" class="actions-product__link _icon-heart">Like</a>
                    </div>
                </div>
            `;

            let productTemplateBody = '';
            productTemplateBody += productTemplateBodyStart;
            productTemplateBody += productTemplateContent;
            productTemplateBody += productTemplatePrices;
            productTemplateBody += productTemplateActions;
            productTemplateBody += productTemplateBodyEnd;

            let productTemplate = '';
            productTemplate += productTemplateStart;
            productTemplate += productTemplateLabels;
            productTemplate += productTemplateImage;
            productTemplate += productTemplateBody;
            productTemplate += productTemplateEnd;
        
            productsItems.insertAdjacentHTML('beforeend', productTemplate);
        });    
    }
    // Add to Cart
    function addToCart(productButton, productId) {
        if (!productButton.classList.contains('_hold')) {
            productButton.classList.add('_hold');
            productButton.classList.add('_fly');

            const cart = document.querySelector('.cart-header__icon');
            const product = document.querySelector(`[data-pid="${productId}"]`);
            const productImage = product.querySelector('.item-product__image');
        
            const productImageFly = productImage.cloneNode(true);
            
            const productImageFlyWidth = productImage.offsetWidth;
            const productImageFlyHeight = productImage.offsetHeight;
            const productImageFlyTop = productImage.getBoundingClientRect().top;
            const productImageFlyLeft = productImage.getBoundingClientRect().left;
        
            productImageFly.setAttribute('class', '_flyImage _ibg');
            productImageFly.style.cssText = 
            `
                left: ${productImageFlyLeft}px;
                top: ${productImageFlyTop}px;
                width: ${productImageFlyWidth}px;
                height: ${productImageFlyHeight}px;
            `;
            
            document.body.append(productImageFly);

            const cartFlyleft = cart.getBoundingClientRect().left;
            const cartFlyTop = cart.getBoundingClientRect().top;

            productImageFly.style.cssText = 
                `
            left: ${cartFlyleft}px;
            top: ${cartFlyTop}px;
            width: 0px;
            height: 0px;
            opacity: 0;
            `;
            ibg();

            productImageFly.addEventListener('transitionend', function() {
                if (productButton.classList.contains('_fly')) {
                    productImageFly.remove();
                    updateCart(productButton, productId);
                    productButton.classList.remove('_fly');
                }
            });
        }
    }

    // Update cart
    function updateCart(productButton, productId, productAdd = true) {
        const cart = document.querySelector('.cart-header');
        const cartIcon = cart.querySelector('.cart-header__icon');
        const cartQuantity = cartIcon.querySelector('span');
        const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
        const cartList = document.querySelector('.cart-list');
    
        // Add
        if (productAdd) {
            if (cartQuantity) {
                cartQuantity.innerHTML = ++cartQuantity.innerHTML;
            } else {
                cartIcon.insertAdjacentHTML('beforeend', '<span>1</span>')
            }
            if (!cartProduct) {
                const product = document.querySelector(`[data-pid="${productId}"]`);
                const cartProductImage = product.querySelector('.item-product__image').innerHTML;
                const cartProductTitle = product.querySelector('.item-product__title').innerHTML;
                const cartProductPrice = product.querySelector('.item-product__price').innerHTML;
                const cartProductContent = `
                <a href="#" class="cart-list__image _ibg">${cartProductImage}</a>
                <div class="cart-list__body">
                    <div class="cart-list__main">
                        <div class="cart-list__info">
                            <a href="#" class="cart-list__title">${cartProductTitle}</a>
                            <div class="cart-list__quantity">Amount: <span class="item-quantity">1</span></div>
                        </div>
                        <a href="#" class="cart-list__delete"><i class="fas fa-trash-alt"></i></a>
                    </div>
                    <div class="cart-list__footer">
                        <div class="cart-list__price">${cartProductPrice}</div>
                    </div>
                </div>
                `;
                cartList.insertAdjacentHTML('beforeend', `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`)

            } else {
                const cartProductQunatity = cartProduct.querySelector('.cart-list__quantity span');
                cartProductQunatity.innerHTML = ++cartProductQunatity.innerHTML;
            }
            // End
            ibg();
            productButton.classList.remove('_hold');
        } else {

            const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
            cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
            if (!parseInt(cartProductQuantity.innerHTML)) {
                cartProduct.remove();
            }

            const cartQuantityValue = --cartQuantity.innerHTML;

            if (cartQuantityValue) {
                cartQuantity.innerHTML = cartQuantityValue;
            } else {
                cartIcon.querySelector('span').remove();
                cartProduct.remove();
                cart.classList.remove('_active');
            }
        }
        updateTotal(cart);
    }

    // Update Total
    function updateTotal(cart) {
        const cartItems = cart.querySelectorAll('.cart-list__item')
        let amount = 0;
        let price = 0;
        for (let i = 0; i< cartItems.length; i++) {
            const cartItem = cartItems[i];
            const itemQuantity = cartItem.querySelector('.item-quantity');
            const itemPrice = cartItem.querySelector('.cart-list__price');
            amount = amount + parseInt(itemQuantity.innerHTML);
            price = price + amount * parseInt(itemPrice.innerHTML.replace(/[^0-9]+/g, ""));
        }
        price = 'Rp ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")
        amount = `Total (${amount} items):`

        const totalAmount = cart.querySelector('.header-total__amount');
        const totalValue = cart.querySelector('.header-total__value');

        totalAmount.innerHTML = amount;
        totalValue.innerHTML = price;
    }

    // Gallery
    const galleryBody = document.querySelector('.gallery__body');
    if (galleryBody && is_touch_enabled()) {
        const galleryItems = galleryBody.querySelector('.gallery__items');
        const galleryColumn = galleryBody.querySelectorAll('.gallery__column');

        const speed = galleryBody.dataset.speed;

        let positionX = 0;
        let coordXprocent = 0;

        function setMouseGalleryStyle() {
            let galleryItemsWidth = 0;
            for (let i = 0; i < galleryColumn.length; i++) {
                galleryItemsWidth += galleryColumn[i].offsetWidth;
            }

            const galleryDifferent = galleryItemsWidth - galleryBody.offsetWidth;
            const distX = Math.floor(coordXprocent - positionX);

            positionX = positionX + (distX * speed);
            let position = galleryDifferent / 200 * positionX;

            galleryItems.style.cssText = `transform: translate3d(${-position}px, 0, 0);`;
            
            if (Math.abs(distX) > 0) {
                requestAnimationFrame(setMouseGalleryStyle);
            } else {
                galleryBody.classList.remove('_init');
            }
        }
        galleryBody.addEventListener('mousemove', function (e) {
            // Get Width
            const galleryWidth = galleryBody.offsetWidth;
            // Set 0 position on middle 
            const coordX = e.pageX - galleryWidth / 2;
            // Get percentage (-100% left; 100% right, 0 middle)
            coordXprocent = coordX / galleryWidth * 200;

            if (!galleryBody.classList.contains('_init')) {
                requestAnimationFrame(setMouseGalleryStyle);
                galleryBody.classList.add('_init');
            }
        })
    }
}
let sliders = document.querySelectorAll('._swiper');
if (sliders) {
    for (let i = 0; i < sliders.length; i++) {
        let slider = sliders[i];
        if (!slider.classList.contains('swiper-bild')) {
            let slider_items = slider.children;
            if (slider_items) {
                for (let i = 0; i < slider_items.length; i++) {
                    let el = slider_items[i];
                    el.classList.add('swiper-slide');
                }
            }
            let slider_content = slider.innerHTML;
            let slider_wrapper = document.createElement('div');
            slider_wrapper.classList.add('swiper-wrapper');
            slider_wrapper.innerHTML = slider_content;
            slider.innerHTML = '';
            slider.appendChild(slider_wrapper);
            slider.classList.add('swiper-bild');

            if (slider.classList.contains('_swiper-scroll')) {
                let sliderScroll = document.createElement('div');
                sliderScroll.classList.add('swiper-scrollbar');
                slider.appendChild(sliderScroll);
            }
        }
    }
    sliders_bild_callback();
}

// let sliderScrollItems = document.querySelectorAll('._swiper_scroll');
// if (sliderScrollItems.length > 0) {
//     for (let i = 0; i < sliderScrollItems.length; i++) {
//         const sliderScrollItem = sliderScrollItems[i];
//         const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
//         const sliderScroll  = new Swiper(sliderScrollItem, {
//             observer: true,
//             observePerents: true,
//             direction: 'vertical',
//             slidesPerView: 'auto',
//             freeMode: 'true',
//             scrollbar: {
//                 el: sliderScrollBar,
//                 draggable: true,
//                 snapOnRelease: false,
//             },
//             mousewheel: {
//                 releaseOnEdges: true,
//             },
//         });
//         sliderScroll.scrollbar.updateSize();
//     }
// }

function sliders_bild_callback(params) {}

if (document.querySelector('.slider-main__body')) {
    new Swiper('.slider-main__body', {
        observer: true,
        observePerents: true,
        slidesPerView: 1,
        spaceBetween: 32,
        watchOverflow: true,
        speed: 800,
        loop: true,
        loopAdditionalSlides: 5,
        preloadImages: false,
        parallax: true,
        // dots
        pagination: {
            el: '.controls-slider-main__dotts',
            clickable: true,
        },
        // arrows
        navigation: { 
            nextEl: '.slider-main .slider-arrow_next',
            prevEl: '.slider-main .slider-arrow_prev',
        },
    });
}

if (document.querySelector('.slider-rooms__body')) {
    new Swiper('.slider-rooms__body', {
        observer: true,
        observePerents: true,
        slidesPerView: 'auto',
        spaceBetween: 24,
        watchOverflow: true,
        speed: 800,
        loop: true,
        loopAdditionalSlides: 5,
        preloadImages: false,
        parallax: true,
        // dots
        pagination: {
            el: '.slider-rooms__dotts',
            clickable: true,
        },
        // arrows
        navigation: { 
            nextEl: '.slider-rooms .slider-arrow_next',
            prevEl: '.slider-rooms .slider-arrow_prev',
        },
    });
}

if (document.querySelector('.slider-tips__body')) {
    new Swiper('.slider-tips__body', {
        observer: true,
        observePerents: true,
        slidesPerView: 3,
        spaceBetween: 32,
        watchOverflow: true,
        speed: 800,
        loop: true,
        // dots
        pagination: {
            el: '.slider-tips__dotts',
            clickable: true,
        },
        // arrows
        navigation: { 
            nextEl: '.slider-tips .slider-arrow_next',
            prevEl: '.slider-tips .slider-arrow_prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 1.1,
                spaceBetween: 15
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 32
            }
        }
    });
}

const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
        return !item.dataset.spollers.split(',')[0];
    });
    if (spollersRegular.length > 0) {
        initSpollers(spollersRegular);
    }

    const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
        return item.dataset.spollers.split(',')[0];
    });
    if (spollersMedia.length > 0) {
        const breakpointsArray = [];
        spollersMedia.forEach(item => {
            const params =  item.dataset.spollers;
            const breakpoint = {};
            const paramsArray = params.split(',');
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
        });

        let mediaQueries = breakpointsArray.map(function (item) {
            return '(' + item.type + '-width: ' + item.value + 'px),' + item.value + ',' + item.type;
        });
        // Get Unique breakpoints
        mediaQueries = mediaQueries.filter(function (item, index, self) {
            return self.indexOf(item) === index;
        }); 

        // Work with each breakpoint
        mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(',');
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);

            // Match needed objects 
            const spollersArray = breakpointsArray.filter(function (item) {
                if (item.value === mediaBreakpoint && item.type === mediaType) {
                    return true;
                }
            })

            // Event
            matchMedia.addListener(function () {
                initSpollers(spollersArray, matchMedia);
            });
            initSpollers(spollersArray, matchMedia);
        })
    }

    // Init
    function initSpollers(spollersArray, matchMedia = false) {
        spollersArray.forEach(spollersBlock => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if (matchMedia.matches || !matchMedia) {
                spollersBlock.classList.add('_init');
                initSpollerBody(spollersBlock);
                spollersBlock.addEventListener('click', setSpollerAction);
            } else {
                spollersBlock.classList.remove('_init');
                initSpollerBody(spollersBlock, false);
                spollersBlock.removeEventListener('click', setSpollerAction);
            }
        })
    }
    // Content
    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
        const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
        if (spollerTitles.length > 0) {
            spollerTitles.forEach(spollerTitle => {
                if (hideSpollerBody) {
                    spollerTitle.removeAttribute('tabindex');
                    if (!spollerTitle.classList.contains('_active')) {
                        spollerTitle.nextElementSibling.hidden = true;
                    }
                } else {
                    spollerTitle.setAttribute('tabindex', '-1');
                    spollerTitle.nextElementSibling.hidden = false;
                }
            });
        }
    }
    function setSpollerAction(e) {
        const el = e.target;
        if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
            const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
            const spollersBlock = spollerTitle.closest('[data-spollers]');
            const oneSpoller = spollersBlock.hasAttribute('[data-one-spoller]') ? true : false;
            if (!spollersBlock.querySelectorAll('._slide').length) {
                if (oneSpoller && !spollerTitle.classList.contains('_active')) {
                    hideSpollerBody(spollersBlock);
                }
                spollerTitle.classList.toggle('_active');
                _slideToggle(spollerTitle.nextElementSibling, 500)
            }
            e.preventDefault();
        }
    }
    function hideSpollerBody(spollersBlock) {
        const spollerActiveTitle = spollersBlock.querySelectorAll('[data-spoller]._active');
        if (spollerActiveTitle) {
            spollerActiveTitle.classList.remove('_active');
            _slideUp(spollerActiveTitle.nextElementSibling, 500);
        }
    }
} 

// ================================================================
let _slideUp = (target, duration=500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.hidden = 'true';
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration) 
    }
}

let _slideDown = (target, duration=500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        if (target.hidden) {
            target.hidden = false;
        }
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration) 
    }
}
let _slideToggle = (target, duration = 500) => {
    if (target.hidden) {
        return _slideDown(target, duration);
    } else {
        return _slideUp(target, duration);
    }
}
/**
 * lightgallery | 2.2.0-beta.0 | June 15th 2021
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.lightGallery=e()}(this,function(){"use strict";var e=function(){return(e=Object.assign||function(t){for(var e,i=1,s=arguments.length;i<s;i++)for(var n in e=arguments[i])Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t}).apply(this,arguments)};"function"!=typeof window.CustomEvent&&(window.CustomEvent=function(t,e){e=e||{bubbles:!1,cancelable:!1,detail:null};var i=document.createEvent("CustomEvent");return i.initCustomEvent(t,e.bubbles,e.cancelable,e.detail),i}),Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var r=(s.generateUUID=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=16*Math.random()|0;return("x"==t?e:3&e|8).toString(16)})},s.prototype._getSelector=function(t,e){return void 0===e&&(e=document),"string"!=typeof t?t:(e=e||document,"#"===t.substring(0,1)?e.querySelector(t):e.querySelectorAll(t))},s.prototype._each=function(t){return this.selector&&(void 0!==this.selector.length?[].forEach.call(this.selector,t):t(this.selector,0)),this},s.prototype._setCssVendorPrefix=function(t,e,i){e=e.replace(/-([a-z])/gi,function(t,e){return e.toUpperCase()});-1!==this.cssVenderPrefixes.indexOf(e)?(t.style[e.charAt(0).toLowerCase()+e.slice(1)]=i,t.style["webkit"+e]=i,t.style["moz"+e]=i,t.style["ms"+e]=i,t.style["o"+e]=i):t.style[e]=i},s.prototype._getFirstEl=function(){return this.selector&&void 0!==this.selector.length?this.selector[0]:this.selector},s.prototype.isEventMatched=function(t,e){var i=e.split(".");return t.split(".").filter(function(t){return t}).every(function(t){return-1!==i.indexOf(t)})},s.prototype.attr=function(e,i){return void 0===i?this.firstElement?this.firstElement.getAttribute(e):"":(this._each(function(t){t.setAttribute(e,i)}),this)},s.prototype.find=function(t){return C(this._getSelector(t,this.selector))},s.prototype.first=function(){return this.selector&&void 0!==this.selector.length?C(this.selector[0]):C(this.selector)},s.prototype.eq=function(t){return C(this.selector[t])},s.prototype.parent=function(){return C(this.selector.parentElement)},s.prototype.get=function(){return this._getFirstEl()},s.prototype.removeAttr=function(t){var i=t.split(" ");return this._each(function(e){i.forEach(function(t){return e.removeAttribute(t)})}),this},s.prototype.wrap=function(t){if(!this.firstElement)return this;var e=document.createElement("div");return e.className=t,this.firstElement.parentNode.insertBefore(e,this.firstElement),this.firstElement.parentNode.removeChild(this.firstElement),e.appendChild(this.firstElement),this},s.prototype.addClass=function(t){return void 0===t&&(t=""),this._each(function(e){t.split(" ").forEach(function(t){e.classList.add(t)})}),this},s.prototype.removeClass=function(t){return this._each(function(e){t.split(" ").forEach(function(t){e.classList.remove(t)})}),this},s.prototype.hasClass=function(t){return!!this.firstElement&&this.firstElement.classList.contains(t)},s.prototype.hasAttribute=function(t){return!!this.firstElement&&this.firstElement.hasAttribute(t)},s.prototype.toggleClass=function(t){return this.firstElement&&(this.hasClass(t)?this.removeClass(t):this.addClass(t)),this},s.prototype.css=function(e,i){var s=this;return this._each(function(t){s._setCssVendorPrefix(t,e,i)}),this},s.prototype.on=function(t,e){var i=this;return this.selector&&t.split(" ").forEach(function(t){Array.isArray(s.eventListeners[t])||(s.eventListeners[t]=[]),s.eventListeners[t].push(e),i.selector.addEventListener(t.split(".")[0],e)}),this},s.prototype.once=function(t,e){var i=this;return this.on(t,function(){i.off(t),e(t)}),this},s.prototype.off=function(t){var i=this;return this.selector&&Object.keys(s.eventListeners).forEach(function(e){i.isEventMatched(t,e)&&(s.eventListeners[e].forEach(function(t){i.selector.removeEventListener(e.split(".")[0],t)}),s.eventListeners[e]=[])}),this},s.prototype.trigger=function(t,e){if(!this.firstElement)return this;e=new CustomEvent(t.split(".")[0],{detail:e||null});return this.firstElement.dispatchEvent(e),this},s.prototype.load=function(t){var e=this;return fetch(t).then(function(t){e.selector.innerHTML=t}),this},s.prototype.html=function(e){return void 0===e?this.firstElement?this.firstElement.innerHTML:"":(this._each(function(t){t.innerHTML=e}),this)},s.prototype.append=function(e){return this._each(function(t){"string"==typeof e?t.insertAdjacentHTML("beforeend",e):t.appendChild(e)}),this},s.prototype.prepend=function(e){return this._each(function(t){t.insertAdjacentHTML("afterbegin",e)}),this},s.prototype.remove=function(){return this._each(function(t){t.parentNode.removeChild(t)}),this},s.prototype.empty=function(){return this._each(function(t){t.innerHTML=""}),this},s.prototype.scrollTop=function(t){return void 0!==t?(document.body.scrollTop=t,document.documentElement.scrollTop=t,this):window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0},s.prototype.scrollLeft=function(t){return void 0!==t?(document.body.scrollLeft=t,document.documentElement.scrollLeft=t,this):window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0},s.prototype.offset=function(){if(!this.firstElement)return{left:0,top:0};var t=this.firstElement.getBoundingClientRect(),e=C("body").style().marginLeft;return{left:t.left-parseFloat(e)+this.scrollLeft(),top:t.top+this.scrollTop()}},s.prototype.style=function(){return this.firstElement?this.firstElement.currentStyle||window.getComputedStyle(this.firstElement):{}},s.prototype.width=function(){var t=this.style();return this.firstElement.clientWidth-parseFloat(t.paddingLeft)-parseFloat(t.paddingRight)},s.prototype.height=function(){var t=this.style();return this.firstElement.clientHeight-parseFloat(t.paddingTop)-parseFloat(t.paddingBottom)},s.eventListeners={},s);function s(t){return this.cssVenderPrefixes=["TransitionDuration","TransitionTimingFunction","Transform","Transition"],this.selector=this._getSelector(t),this.firstElement=this._getFirstEl(),this}function C(t){return new r(t)}var i=["src","sources","subHtml","subHtmlUrl","html","video","poster","slideName","responsive","srcset","sizes","iframe","downloadUrl","width","facebookShareUrl","tweetText","iframeTitle","twitterShareUrl","pinterestShareUrl","pinterestText","fbHtml","disqusIdentifier","disqusUrl"];var I=function(t,e,i,s){void 0===i&&(i=0);var n=C(t).attr("data-lg-size")||s;if(n){var o=n.split(",");if(o[1])for(var r=window.innerWidth,l=0;l<o.length;l++){var a=o[l];if(r<parseInt(a.split("-")[2],10)){n=a;break}l===o.length-1&&(n=a)}var g=n.split("-"),t=parseInt(g[0],10),s=parseInt(g[1],10),g=e.width(),i=e.height()-i,g=Math.min(g,t),i=Math.min(i,s),i=Math.min(g/t,i/s);return{width:t*i,height:s*i}}},l=function(t,e,i,s,n){if(n){var o=C(t).find("img").first();if(o.get()){var r=e.get().getBoundingClientRect(),l=r.width,a=e.height()-(i+s),t=o.width(),e=o.height(),s=o.style(),r=(l-t)/2-o.offset().left+(parseFloat(s.paddingLeft)||0)+(parseFloat(s.borderLeft)||0)+C(window).scrollLeft()+r.left,i=(a-e)/2-o.offset().top+(parseFloat(s.paddingTop)||0)+(parseFloat(s.borderTop)||0)+C(window).scrollTop()+i;return"translate3d("+(r*=-1)+"px, "+(i*=-1)+"px, 0) scale3d("+t/n.width+", "+e/n.height+", 1)"}}},x=function(t,e,i,s){return'<div class="lg-video-cont lg-has-iframe" style="width:'+e+"; height: "+i+'">\n                    <iframe class="lg-object" frameborder="0" '+(s?'title="'+s+'"':"")+' src="'+t+'"  allowfullscreen="true"></iframe>\n                </div>'},w=function(t,e,i,s,n,o){t="<img "+i+" "+(s?'srcset="'+s+'"':"")+"  "+(n?'sizes="'+n+'"':"")+' class="lg-object lg-image" data-index="'+t+'" src="'+e+'" />',e="";return o&&(e=("string"==typeof o?JSON.parse(o):o).map(function(e){var i="";return Object.keys(e).forEach(function(t){i+=" "+t+'="'+e[t]+'"'}),"<source "+i+"></source>"})),e+t},S=function(t){for(var e=[],i=[],s="",n=0;n<t.length;n++){var o=t[n].split(" ");""===o[0]&&o.splice(0,1),i.push(o[0]),e.push(o[1])}for(var r=window.innerWidth,l=0;l<e.length;l++)if(parseInt(e[l],10)>r){s=i[l];break}return s},T=function(t){return!!t&&(!!t.complete&&0!==t.naturalWidth)},E=function(t,e,i,s){return'<div class="lg-video-cont '+(s&&s.youtube?"lg-has-youtube":s&&s.vimeo?"lg-has-vimeo":"lg-has-html5")+'" style="'+i+'">\n                <div class="lg-video-play-button">\n                <svg\n                    viewBox="0 0 20 20"\n                    preserveAspectRatio="xMidYMid"\n                    focusable="false"\n                    aria-labelledby="Play video"\n                    role="img"\n                    class="lg-video-play-icon"\n                >\n                    <title>Play video</title>\n                    <polygon class="lg-video-play-icon-inner" points="1,0 20,10 1,20"></polygon>\n                </svg>\n                <svg class="lg-video-play-icon-bg" viewBox="0 0 50 50" focusable="false">\n                    <circle cx="50%" cy="50%" r="20"></circle></svg>\n                <svg class="lg-video-play-icon-circle" viewBox="0 0 50 50" focusable="false">\n                    <circle cx="50%" cy="50%" r="20"></circle>\n                </svg>\n            </div>\n            '+(e||"")+'\n            <img class="lg-object lg-video-poster" src="'+t+'" />\n        </div>'},n=function(t,e,g,h){var d=[],c=function(){for(var t=0,e=0,i=arguments.length;e<i;e++)t+=arguments[e].length;for(var s=Array(t),n=0,e=0;e<i;e++)for(var o=arguments[e],r=0,l=o.length;r<l;r++,n++)s[n]=o[r];return s}(i,e);return[].forEach.call(t,function(t){for(var e={},i=0;i<t.attributes.length;i++){var s,n,o=t.attributes[i];o.specified&&(s="href"===(n=o.name)?"src":n=(n=(n=n.replace("data-","")).charAt(0).toLowerCase()+n.slice(1)).replace(/-([a-z])/g,function(t){return t[1].toUpperCase()}),n="",-1<c.indexOf(s)&&(n=s),n&&(e[n]=o.value))}var r=C(t),l=r.find("img").first().attr("alt"),a=r.attr("title"),r=h?r.attr(h):r.find("img").first().attr("src");e.thumb=r,g&&!e.subHtml&&(e.subHtml=a||l||""),e.alt=l||a||"",d.push(e)}),d},o=function(){return/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)},a={mode:"lg-slide",easing:"ease",speed:400,licenseKey:"0000-0000-000-0000",height:"100%",width:"100%",addClass:"",startClass:"lg-start-zoom",backdropDuration:300,container:document.body,startAnimationDuration:400,zoomFromOrigin:!0,hideBarsDelay:0,showBarsAfter:1e4,slideDelay:0,supportLegacyBrowser:!0,allowMediaOverlap:!1,videoMaxSize:"1280-720",defaultCaptionHeight:0,ariaLabelledby:"",ariaDescribedby:"",closable:!0,swipeToClose:!0,closeOnTap:!0,showCloseIcon:!0,showMaximizeIcon:!1,loop:!0,escKey:!0,keyPress:!0,controls:!0,slideEndAnimation:!0,hideControlOnEnd:!1,mousewheel:!1,getCaptionFromTitleOrAlt:!0,appendSubHtmlTo:".lg-sub-html",subHtmlSelectorRelative:!1,preload:2,numberOfSlideItemsInDom:10,showAfterLoad:!0,selector:"",selectWithin:"",nextHtml:"",prevHtml:"",index:0,iframeWidth:"100%",iframeHeight:"100%",download:!0,counter:!0,appendCounterTo:".lg-toolbar",swipeThreshold:50,enableSwipe:!0,enableDrag:!0,dynamic:!1,dynamicEl:[],extraProps:[],exThumbImage:"",isMobile:void 0,mobileSettings:{controls:!1,showCloseIcon:!1,download:!1},plugins:[]},O="lgAfterAppendSlide",g="lgInit",L="lgHasVideo",h="lgContainerResize",d="lgUpdateSlides",c="lgAfterAppendSubHtml",u="lgBeforeOpen",m="lgAfterOpen",p="lgSlideItemLoad",f="lgBeforeSlide",y="lgAfterSlide",v="lgPosterClick",b="lgDragStart",D="lgDragMove",z="lgDragEnd",G="lgBeforeNextSlide",M="lgBeforePrevSlide",k="lgBeforeClose",A="lgAfterClose",B=0,P=(t.prototype.generateSettings=function(t){this.settings=e(e({},a),t),(this.settings.isMobile&&"function"==typeof this.settings.isMobile?this.settings.isMobile():o())&&(t=e(e({},this.settings.mobileSettings),this.settings.mobileSettings),this.settings=e(e({},this.settings),t))},t.prototype.normalizeSettings=function(){this.settings.slideEndAnimation&&(this.settings.hideControlOnEnd=!1),this.settings.closable||(this.settings.swipeToClose=!1),this.zoomFromOrigin=this.settings.zoomFromOrigin,this.settings.dynamic&&(this.zoomFromOrigin=!1),this.settings.container||(this.settings.container=document.body),this.settings.preload=Math.min(this.settings.preload,this.galleryItems.length)},t.prototype.init=function(){var t=this;this.addSlideVideoInfo(this.galleryItems),this.buildStructure(),this.LGel.trigger(g,{instance:this}),this.settings.keyPress&&this.keyPress(),setTimeout(function(){t.enableDrag(),t.enableSwipe()},50),this.arrow(),this.settings.mousewheel&&this.mousewheel(),this.settings.dynamic||this.openGalleryOnItemClick()},t.prototype.openGalleryOnItemClick=function(){for(var n=this,o=this,t=0;t<this.items.length;t++)!function(e){var i=o.items[e],t=C(i),s=r.generateUUID();t.attr("data-lg-id",s).on("click.lgcustom-item-"+s,function(t){t.preventDefault();t=n.settings.index||e;n.openGallery(t,i)})}(t)},t.prototype.buildModules=function(){var e=this;this.settings.plugins.forEach(function(t){e.plugins.push(new t(e,C))})},t.prototype.validateLicense=function(){this.settings.licenseKey?"0000-0000-000-0000"===this.settings.licenseKey&&console.warn("lightGallery: "+this.settings.licenseKey+" license key is not valid for production use"):console.error("Please provide a valid license key")},t.prototype.getSlideItem=function(t){return C(this.getSlideItemId(t))},t.prototype.getSlideItemId=function(t){return"#lg-item-"+this.lgId+"-"+t},t.prototype.getIdName=function(t){return t+"-"+this.lgId},t.prototype.getElementById=function(t){return C("#"+this.getIdName(t))},t.prototype.manageSingleSlideClassName=function(){this.galleryItems.length<2?this.outer.addClass("lg-single-item"):this.outer.removeClass("lg-single-item")},t.prototype.buildStructure=function(){var t,e,i,s,n,o,r,l,a=this;this.$container&&this.$container.get()||(l=t="",this.settings.controls&&(t='<button type="button" id="'+this.getIdName("lg-prev")+'" aria-label="Previous slide" class="lg-prev lg-icon"> '+this.settings.prevHtml+' </button>\n                <button type="button" id="'+this.getIdName("lg-next")+'" aria-label="Next slide" class="lg-next lg-icon"> '+this.settings.nextHtml+" </button>"),".lg-sub-html"===this.settings.appendSubHtmlTo&&(l='<div class="lg-sub-html" role="status" aria-live="polite"></div>'),e="",this.settings.allowMediaOverlap&&(e+="lg-media-overlap "),i=this.settings.ariaLabelledby?'aria-labelledby="'+this.settings.ariaLabelledby+'"':"",s=this.settings.ariaDescribedby?'aria-describedby="'+this.settings.ariaDescribedby+'"':"",n="lg-container "+this.settings.addClass+" "+(document.body!==this.settings.container?"lg-inline":""),o=this.settings.closable&&this.settings.showCloseIcon?'<button type="button" aria-label="Close gallery" id="'+this.getIdName("lg-close")+'" class="lg-close lg-icon"></button>':"",r=this.settings.showMaximizeIcon?'<button type="button" aria-label="Toggle maximize" id="'+this.getIdName("lg-maximize")+'" class="lg-maximize lg-icon"></button>':"",l='\n        <div class="'+n+'" id="'+this.getIdName("lg-container")+'" tabindex="-1" aria-modal="true" '+i+" "+s+' role="dialog"\n        >\n            <div id="'+this.getIdName("lg-backdrop")+'" class="lg-backdrop"></div>\n\n            <div id="'+this.getIdName("lg-outer")+'" class="lg-outer lg-use-css3 lg-css3 lg-hide-items '+e+' ">\n                    <div id="'+this.getIdName("lg-content")+'" class="lg" style="width: '+this.settings.width+"; height:"+this.settings.height+'">\n                        <div id="'+this.getIdName("lg-inner")+'" class="lg-inner"></div>\n                        <div id="'+this.getIdName("lg-toolbar")+'" class="lg-toolbar lg-group">\n                        '+r+"\n                        "+o+"\n                    </div>\n                    "+t+'\n                    <div id="'+this.getIdName("lg-components")+'" class="lg-components">\n                        '+l+"\n                    </div>\n                </div> \n            </div>\n        </div>\n        ",C(this.settings.container).css("position","relative").append(l),this.outer=this.getElementById("lg-outer"),this.$lgContent=this.getElementById("lg-content"),this.$lgComponents=this.getElementById("lg-components"),this.$backdrop=this.getElementById("lg-backdrop"),this.$container=this.getElementById("lg-container"),this.$inner=this.getElementById("lg-inner"),this.$toolbar=this.getElementById("lg-toolbar"),this.$backdrop.css("transition-duration",this.settings.backdropDuration+"ms"),l=this.settings.mode+" ",this.manageSingleSlideClassName(),this.settings.enableDrag&&(l+="lg-grab "),this.settings.showAfterLoad&&(l+="lg-show-after-load"),this.outer.addClass(l),this.$inner.css("transition-timing-function",this.settings.easing),this.$inner.css("transition-duration",this.settings.speed+"ms"),this.settings.download&&this.$toolbar.append('<a id="'+this.getIdName("lg-download")+'" target="_blank" aria-label="Download" download class="lg-download lg-icon"></a>'),this.counter(),C(window).on("resize.lg.global"+this.lgId+" orientationchange.lg.global"+this.lgId,function(){a.refreshOnResize()}),this.hideBars(),this.manageCloseGallery(),this.toggleMaximize(),this.initModules())},t.prototype.refreshOnResize=function(){var t,e,i;this.lgOpened&&(i=this.galleryItems[this.index].__slideVideoInfo,t=(e=this.getMediaContainerPosition()).top,e=e.bottom,this.currentImageSize=I(this.items[this.index],this.$lgContent,t+e,i&&this.settings.videoMaxSize),i&&this.resizeVideoSlide(this.index,this.currentImageSize),this.zoomFromOrigin&&!this.isDummyImageRemoved&&(i=this.getDummyImgStyles(this.currentImageSize),this.outer.find(".lg-current .lg-dummy-img").first().attr("style",i)),this.LGel.trigger(h))},t.prototype.resizeVideoSlide=function(t,e){e=this.getVideoContStyle(e);this.getSlideItem(t).find(".lg-video-cont").attr("style",e)},t.prototype.updateSlides=function(t,e){var i,s;this.index>t.length-1&&(this.index=t.length-1),1===t.length&&(this.index=0),t.length?(i=this.galleryItems[e].src,this.addSlideVideoInfo(t),this.galleryItems=t,this.$inner.empty(),this.currentItemsInDom=[],s=0,this.galleryItems.some(function(t,e){return t.src===i&&(s=e,!0)}),this.currentItemsInDom=this.organizeSlideItems(s,-1),this.loadContent(s,!0),this.getSlideItem(s).addClass("lg-current"),this.index=s,this.updateCurrentCounter(s),this.updateCounterTotal(),this.LGel.trigger(d)):this.closeGallery()},t.prototype.getItems=function(){return this.items=[],this.settings.dynamic?this.settings.dynamicEl||[]:("this"===this.settings.selector?this.items.push(this.el):this.settings.selector?"string"==typeof this.settings.selector?this.settings.selectWithin?(t=C(this.settings.selectWithin),this.items=t.find(this.settings.selector).get()):this.items=this.el.querySelectorAll(this.settings.selector):this.items=this.settings.selector:this.items=this.el.children,n(this.items,this.settings.extraProps,this.settings.getCaptionFromTitleOrAlt,this.settings.exThumbImage));var t},t.prototype.openGallery=function(e,t){var i,s,n,o,r=this;void 0===e&&(e=this.settings.index),this.lgOpened||(this.lgOpened=!0,this.outer.get().focus(),this.outer.removeClass("lg-hide-items"),this.$container.addClass("lg-show"),n=this.getItemsToBeInsertedToDom(e,e),this.currentItemsInDom=n,i="",n.forEach(function(t){i=i+'<div id="'+t+'" class="lg-item"></div>'}),this.$inner.append(i),this.addHtml(e),s="",this.mediaContainerPosition=this.getMediaContainerPosition(),n=(o=this.mediaContainerPosition).top,o=o.bottom,this.settings.allowMediaOverlap||this.setMediaContainerPosition(n,o),this.zoomFromOrigin&&t&&(this.currentImageSize=I(t,this.$lgContent,n+o,this.galleryItems[e].__slideVideoInfo&&this.settings.videoMaxSize),s=l(t,this.$lgContent,n,o,this.currentImageSize)),this.zoomFromOrigin&&s||(this.outer.addClass(this.settings.startClass),this.getSlideItem(e).removeClass("lg-complete")),o=this.settings.zoomFromOrigin?100:this.settings.backdropDuration,setTimeout(function(){r.outer.addClass("lg-components-open")},o),this.index=e,this.LGel.trigger(u),this.getSlideItem(e).addClass("lg-current"),this.lGalleryOn=!1,this.prevScrollTop=C(window).scrollTop(),setTimeout(function(){var t;r.zoomFromOrigin&&s&&((t=r.getSlideItem(e)).css("transform",s),setTimeout(function(){t.addClass("lg-start-progress lg-start-end-progress").css("transition-duration",r.settings.startAnimationDuration+"ms"),r.outer.addClass("lg-zoom-from-image")}),setTimeout(function(){t.css("transform","translate3d(0, 0, 0)")},100)),setTimeout(function(){r.$backdrop.addClass("in"),r.$container.addClass("lg-show-in")},10),r.zoomFromOrigin&&s||setTimeout(function(){r.outer.addClass("lg-visible")},r.settings.backdropDuration),r.slide(e,!1,!1,!1),r.LGel.trigger(m)}),document.body===this.settings.container&&C("html").addClass("lg-on"))},t.prototype.getMediaContainerPosition=function(){if(this.settings.allowMediaOverlap)return{top:0,bottom:0};var t=this.$toolbar.get().clientHeight||0,e=this.settings.defaultCaptionHeight||this.outer.find(".lg-sub-html").get().clientHeight,i=this.outer.find(".lg-thumb-outer").get();return{top:t,bottom:(i?i.clientHeight:0)+e}},t.prototype.setMediaContainerPosition=function(t,e){void 0===t&&(t=0),void 0===e&&(e=0),this.$inner.css("top",t+"px").css("bottom",e+"px")},t.prototype.hideBars=function(){var t=this;setTimeout(function(){t.outer.removeClass("lg-hide-items"),0<t.settings.hideBarsDelay&&(t.outer.on("mousemove.lg click.lg touchstart.lg",function(){t.outer.removeClass("lg-hide-items"),clearTimeout(t.hideBarTimeout),t.hideBarTimeout=setTimeout(function(){t.outer.addClass("lg-hide-items")},t.settings.hideBarsDelay)}),t.outer.trigger("mousemove.lg"))},this.settings.showBarsAfter)},t.prototype.initPictureFill=function(t){if(this.settings.supportLegacyBrowser)try{picturefill({elements:[t.get()]})}catch(t){console.warn("lightGallery :- If you want srcset or picture tag to be supported for older browser please include picturefil javascript library in your document.")}},t.prototype.counter=function(){var t;this.settings.counter&&(t='<div class="lg-counter" role="status" aria-live="polite">\n                <span id="'+this.getIdName("lg-counter-current")+'" class="lg-counter-current">'+(this.index+1)+' </span> / \n                <span id="'+this.getIdName("lg-counter-all")+'" class="lg-counter-all">'+this.galleryItems.length+" </span></div>",this.outer.find(this.settings.appendCounterTo).append(t))},t.prototype.addHtml=function(t){var e,i,s;this.galleryItems[t].subHtmlUrl?i=this.galleryItems[t].subHtmlUrl:e=this.galleryItems[t].subHtml,i||(e?"."!==(s=e.substring(0,1))&&"#"!==s||(e=(this.settings.subHtmlSelectorRelative&&!this.settings.dynamic?C(this.items).eq(t).find(e):C(e)).first().html()):e=""),".lg-sub-html"===this.settings.appendSubHtmlTo?i?this.outer.find(".lg-sub-html").load(i):this.outer.find(".lg-sub-html").html(e):(s=C(this.getSlideItemId(t)),i?s.load(i):s.append('<div class="lg-sub-html">'+e+"</div>")),null!=e&&(""===e?this.outer.find(this.settings.appendSubHtmlTo).addClass("lg-empty-html"):this.outer.find(this.settings.appendSubHtmlTo).removeClass("lg-empty-html")),this.LGel.trigger(c,{index:t})},t.prototype.preload=function(t){for(var e=1;e<=this.settings.preload&&!(e>=this.galleryItems.length-t);e++)this.loadContent(t+e,!1);for(var i=1;i<=this.settings.preload&&!(t-i<0);i++)this.loadContent(t-i,!1)},t.prototype.getDummyImgStyles=function(t){return t?"width:"+t.width+"px; \n                margin-left: -"+t.width/2+"px;\n                margin-top: -"+t.height/2+"px; \n                height:"+t.height+"px":""},t.prototype.getVideoContStyle=function(t){return t?"width:"+t.width+"px; \n                height:"+t.height+"px":""},t.prototype.getDummyImageContent=function(t,e,i){var s;if(this.settings.dynamic||(s=C(this.items).eq(e)),s){e=void 0;if(!(e=this.settings.exThumbImage?s.attr(this.settings.exThumbImage):s.find("img").first().attr("src")))return"";e="<img "+i+' style="'+this.getDummyImgStyles(this.currentImageSize)+'" class="lg-dummy-img" src="'+e+'" />';return t.addClass("lg-first-slide"),this.outer.addClass("lg-first-slide-loading"),e}return""},t.prototype.setImgMarkup=function(t,e,i){var s=this.galleryItems[i],n=s.alt,o=s.srcset,r=s.sizes,s=s.sources,n=n?'alt="'+n+'"':"",s='<picture class="lg-img-wrap"> '+(!this.lGalleryOn&&this.zoomFromOrigin&&this.currentImageSize?this.getDummyImageContent(e,i,n):w(i,t,n,o,r,s))+"</picture>";e.prepend(s)},t.prototype.onLgObjectLoad=function(t,e,i,s,n){var o=this;n&&this.LGel.trigger(p,{index:e,delay:i||0}),t.find(".lg-object").first().on("load.lg",function(){o.handleLgObjectLoad(t,e,i,s,n)}),setTimeout(function(){t.find(".lg-object").first().on("error.lg",function(){t.addClass("lg-complete lg-complete_"),t.html('<span class="lg-error-msg">Oops... Failed to load content...</span>')})},s)},t.prototype.handleLgObjectLoad=function(t,e,i,s,n){var o=this;setTimeout(function(){t.addClass("lg-complete lg-complete_"),n||o.LGel.trigger(p,{index:e,delay:i||0})},s)},t.prototype.isVideo=function(t,e){if(!t)return this.galleryItems[e].video?{html5:!0}:void console.error("lightGallery :- data-src is not provided on slide item "+(e+1)+". Please make sure the selector property is properly configured. More info - https://www.lightgalleryjs.com/demos/html-markup/");var i=t.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i),e=t.match(/\/\/(?:www\.)?(?:player\.)?vimeo.com\/(?:video\/)?([0-9a-z\-_]+)/i),t=t.match(/https?:\/\/(.+)?(wistia\.com|wi\.st)\/(medias|embed)\/([0-9a-z\-_]+)(.*)/);return i?{youtube:i}:e?{vimeo:e}:t?{wistia:t}:void 0},t.prototype.addSlideVideoInfo=function(t){var i=this;t.forEach(function(t,e){t.__slideVideoInfo=i.isVideo(t.src,e)})},t.prototype.loadContent=function(e,t){var i=this,s=this.galleryItems[e],n=C(this.getSlideItemId(e)),o=s.poster,r=s.srcset,l=s.sizes,a=s.sources,g=s.src,h=s.video,d=h&&"string"==typeof h?JSON.parse(h):h;s.responsive&&(c=s.responsive.split(","),g=S(c)||g);var c,u,m,p,f=s.__slideVideoInfo,y="",h=!!s.iframe;n.hasClass("lg-loaded")||(f&&(c=(u=this.mediaContainerPosition).top,u=u.bottom,u=I(this.items[e],this.$lgContent,c+u,f&&this.settings.videoMaxSize),y=this.getVideoContStyle(u)),h?(p=x(g,this.settings.iframeWidth,this.settings.iframeHeight,s.iframeTitle),n.prepend(p)):o?(u="",m=!this.lGalleryOn,(h=!this.lGalleryOn&&this.zoomFromOrigin&&this.currentImageSize)&&(u=this.getDummyImageContent(n,e,"")),p=E(o,u||"",y,f),n.prepend(p),h=(h?this.settings.startAnimationDuration:this.settings.backdropDuration)+100,setTimeout(function(){i.LGel.trigger(L,{index:e,src:g,html5Video:d,hasPoster:!0,isFirstSlide:m})},h)):f?(p='<div class="lg-video-cont " style="'+y+'"></div>',n.prepend(p),this.LGel.trigger(L,{index:e,src:g,html5Video:d,hasPoster:!1})):(this.setImgMarkup(g,n,e),(r||a)&&(p=n.find(".lg-object"),this.initPictureFill(p))),this.LGel.trigger(O,{index:e}),this.lGalleryOn&&".lg-sub-html"!==this.settings.appendSubHtmlTo&&this.addHtml(e));var v=0,b=0;this.lGalleryOn||(b=this.zoomFromOrigin&&this.currentImageSize?this.settings.startAnimationDuration+10:this.settings.backdropDuration+10),b&&!C(document.body).hasClass("lg-from-hash")&&(v=b),!this.lGalleryOn&&this.zoomFromOrigin&&this.currentImageSize&&(setTimeout(function(){n.removeClass("lg-start-end-progress lg-start-progress").removeAttr("style")},this.settings.startAnimationDuration+100),n.hasClass("lg-loaded")||setTimeout(function(){n.find(".lg-img-wrap").append(w(e,g,"",r,l,s.sources)),(r||a)&&(t=n.find(".lg-object"),i.initPictureFill(t)),i.onLgObjectLoad(n,e,b,v,!0);var t=n.find(".lg-object").first();T(t.get())?i.loadContentOnLoad(e,n,v):t.on("load.lg error.lg",function(){i.loadContentOnLoad(e,n,v)})},this.settings.startAnimationDuration+100)),n.addClass("lg-loaded"),this.onLgObjectLoad(n,e,b,v,!1),f&&f.html5&&!o&&n.addClass("lg-complete lg-complete_"),this.zoomFromOrigin&&this.currentImageSize||!n.hasClass("lg-complete_")||this.lGalleryOn||setTimeout(function(){n.addClass("lg-complete")},this.settings.backdropDuration),(this.lGalleryOn=!0)===t&&(n.hasClass("lg-complete_")?this.preload(e):n.find(".lg-object").first().on("load.lg error.lg",function(){i.preload(e)}))},t.prototype.loadContentOnLoad=function(t,e,i){var s=this;setTimeout(function(){e.find(".lg-dummy-img").remove(),e.removeClass("lg-first-slide"),s.outer.removeClass("lg-first-slide-loading"),s.isDummyImageRemoved=!0,s.preload(t)},i+300)},t.prototype.getItemsToBeInsertedToDom=function(t,e,i){var s=this;void 0===i&&(i=0);var n=[],o=Math.max(i,3),o=Math.min(o,this.galleryItems.length),i="lg-item-"+this.lgId+"-"+e;if(this.galleryItems.length<=3)return this.galleryItems.forEach(function(t,e){n.push("lg-item-"+s.lgId+"-"+e)}),n;if(t<(this.galleryItems.length-1)/2){for(var r=t;t-o/2<r&&0<=r;r--)n.push("lg-item-"+this.lgId+"-"+r);for(var l=n.length,r=0;r<o-l;r++)n.push("lg-item-"+this.lgId+"-"+(t+r+1))}else{for(r=t;r<=this.galleryItems.length-1&&r<t+o/2;r++)n.push("lg-item-"+this.lgId+"-"+r);for(l=n.length,r=0;r<o-l;r++)n.push("lg-item-"+this.lgId+"-"+(t-r-1))}return this.settings.loop&&(t===this.galleryItems.length-1?n.push("lg-item-"+this.lgId+"-0"):0===t&&n.push("lg-item-"+this.lgId+"-"+(this.galleryItems.length-1))),-1===n.indexOf(i)&&n.push("lg-item-"+this.lgId+"-"+e),n},t.prototype.organizeSlideItems=function(t,e){var i=this,s=this.getItemsToBeInsertedToDom(t,e,this.settings.numberOfSlideItemsInDom);return s.forEach(function(t){-1===i.currentItemsInDom.indexOf(t)&&i.$inner.append('<div id="'+t+'" class="lg-item"></div>')}),this.currentItemsInDom.forEach(function(t){-1===s.indexOf(t)&&C("#"+t).remove()}),s},t.prototype.getPreviousSlideIndex=function(){var e=0;try{var t=this.outer.find(".lg-current").first().attr("id"),e=parseInt(t.split("-")[3])||0}catch(t){e=0}return e},t.prototype.setDownloadValue=function(t){var e;!this.settings.download||(t=!1!==(e=this.galleryItems[t]).downloadUrl&&(e.downloadUrl||e.src))&&!e.iframe&&this.getElementById("lg-download").attr("href",t)},t.prototype.makeSlideAnimation=function(t,e,i){var s=this;this.lGalleryOn&&i.addClass("lg-slide-progress"),setTimeout(function(){s.outer.addClass("lg-no-trans"),s.outer.find(".lg-item").removeClass("lg-prev-slide lg-next-slide"),"prev"===t?(e.addClass("lg-prev-slide"),i.addClass("lg-next-slide")):(e.addClass("lg-next-slide"),i.addClass("lg-prev-slide")),setTimeout(function(){s.outer.find(".lg-item").removeClass("lg-current"),e.addClass("lg-current"),s.outer.removeClass("lg-no-trans")},50)},this.lGalleryOn?this.settings.slideDelay:0)},t.prototype.slide=function(t,e,i,s){var n,o,r,l,a,g,h=this,d=this.getPreviousSlideIndex();this.currentItemsInDom=this.organizeSlideItems(t,d),this.lGalleryOn&&d===t||(n=this.galleryItems.length,this.lgBusy||(this.settings.counter&&this.updateCurrentCounter(t),o=this.getSlideItem(t),r=this.getSlideItem(d),a=(l=this.galleryItems[t]).__slideVideoInfo,this.outer.attr("data-lg-slide-type",this.getSlideType(l)),this.setDownloadValue(t),a&&(l=(g=this.mediaContainerPosition).top,g=g.bottom,g=I(this.items[t],this.$lgContent,l+g,a&&this.settings.videoMaxSize),this.resizeVideoSlide(t,g)),this.LGel.trigger(f,{prevIndex:d,index:t,fromTouch:!!e,fromThumb:!!i}),this.lgBusy=!0,clearTimeout(this.hideBarTimeout),this.arrowDisable(t),s||(t<d?s="prev":d<t&&(s="next")),e?(this.outer.find(".lg-item").removeClass("lg-prev-slide lg-current lg-next-slide"),g=a=void 0,2<n?(a=t-1,g=t+1,(0===t&&d===n-1||t===n-1&&0===d)&&(g=0,a=n-1)):(a=0,g=1),"prev"===s?this.getSlideItem(g).addClass("lg-next-slide"):this.getSlideItem(a).addClass("lg-prev-slide"),o.addClass("lg-current")):this.makeSlideAnimation(s,o,r),this.lGalleryOn||this.loadContent(t,!0),setTimeout(function(){h.lGalleryOn&&h.loadContent(t,!0),".lg-sub-html"===h.settings.appendSubHtmlTo&&h.addHtml(t)},(this.lGalleryOn?this.settings.speed+50:50)+(e?0:this.settings.slideDelay)),setTimeout(function(){h.lgBusy=!1,r.removeClass("lg-slide-progress"),h.LGel.trigger(y,{prevIndex:d,index:t,fromTouch:e,fromThumb:i})},(this.lGalleryOn?this.settings.speed+100:100)+(e?0:this.settings.slideDelay))),this.index=t)},t.prototype.updateCurrentCounter=function(t){this.getElementById("lg-counter-current").html(t+1+"")},t.prototype.updateCounterTotal=function(){this.getElementById("lg-counter-all").html(this.galleryItems.length+"")},t.prototype.getSlideType=function(t){return t.__slideVideoInfo?"video":t.iframe?"iframe":"image"},t.prototype.touchMove=function(t,e){var i,s=e.pageX-t.pageX,n=e.pageY-t.pageY,e=!1;this.swipeDirection?e=!0:15<Math.abs(s)?(this.swipeDirection="horizontal",e=!0):15<Math.abs(n)&&(this.swipeDirection="vertical",e=!0),e&&(t=this.getSlideItem(this.index),"horizontal"===this.swipeDirection?(this.outer.addClass("lg-dragging"),this.setTranslate(t,s,0),i=15*(e=t.get().offsetWidth)/100-Math.abs(10*s/100),this.setTranslate(this.outer.find(".lg-prev-slide").first(),s-e-i,0),this.setTranslate(this.outer.find(".lg-next-slide").first(),e+s+i,0)):"vertical"===this.swipeDirection&&this.settings.swipeToClose&&(this.$container.addClass("lg-dragging-vertical"),i=1-Math.abs(n)/window.innerHeight,this.$backdrop.css("opacity",i),i=1-Math.abs(n)/(2*window.innerWidth),this.setTranslate(t,0,n,i,i),100<Math.abs(n)&&this.outer.addClass("lg-hide-items").removeClass("lg-components-open")))},t.prototype.touchEnd=function(i,s,n){var o,r=this;"lg-slide"!==this.settings.mode&&this.outer.addClass("lg-slide"),setTimeout(function(){r.$container.removeClass("lg-dragging-vertical"),r.outer.removeClass("lg-dragging lg-hide-items").addClass("lg-components-open");var t=!0;if("horizontal"===r.swipeDirection){o=i.pageX-s.pageX;var e=Math.abs(i.pageX-s.pageX);o<0&&e>r.settings.swipeThreshold?(r.goToNextSlide(!0),t=!1):0<o&&e>r.settings.swipeThreshold&&(r.goToPrevSlide(!0),t=!1)}else if("vertical"===r.swipeDirection){if(o=Math.abs(i.pageY-s.pageY),r.settings.closable&&r.settings.swipeToClose&&100<o)return void r.closeGallery();r.$backdrop.css("opacity",1)}r.outer.find(".lg-item").removeAttr("style"),t&&Math.abs(i.pageX-s.pageX)<5&&(t=C(n.target),r.isPosterElement(t)&&r.LGel.trigger(v)),r.swipeDirection=void 0}),setTimeout(function(){r.outer.hasClass("lg-dragging")||"lg-slide"===r.settings.mode||r.outer.removeClass("lg-slide")},this.settings.speed+100)},t.prototype.enableSwipe=function(){var i=this,s={},e={},n=!1,o=!1;this.settings.enableSwipe&&(this.$inner.on("touchstart.lg",function(t){t.preventDefault();var e=i.getSlideItem(i.index);!C(t.target).hasClass("lg-item")&&!e.get().contains(t.target)||i.outer.hasClass("lg-zoomed")||i.lgBusy||1!==t.targetTouches.length||(o=!0,i.touchAction="swipe",i.manageSwipeClass(),s={pageX:t.targetTouches[0].pageX,pageY:t.targetTouches[0].pageY})}),this.$inner.on("touchmove.lg",function(t){t.preventDefault(),o&&"swipe"===i.touchAction&&1===t.targetTouches.length&&(e={pageX:t.targetTouches[0].pageX,pageY:t.targetTouches[0].pageY},i.touchMove(s,e),n=!0)}),this.$inner.on("touchend.lg",function(t){"swipe"===i.touchAction&&(n?(n=!1,i.touchEnd(e,s,t)):o&&(t=C(t.target),i.isPosterElement(t)&&i.LGel.trigger(v)),i.touchAction=void 0,o=!1)}))},t.prototype.enableDrag=function(){var i=this,s={},n={},o=!1,r=!1;this.settings.enableDrag&&(this.outer.on("mousedown.lg",function(t){var e=i.getSlideItem(i.index);(C(t.target).hasClass("lg-item")||e.get().contains(t.target))&&(i.outer.hasClass("lg-zoomed")||i.lgBusy||(t.preventDefault(),i.lgBusy||(i.manageSwipeClass(),s={pageX:t.pageX,pageY:t.pageY},o=!0,i.outer.get().scrollLeft+=1,--i.outer.get().scrollLeft,i.outer.removeClass("lg-grab").addClass("lg-grabbing"),i.LGel.trigger(b))))}),C(window).on("mousemove.lg.global"+this.lgId,function(t){o&&i.lgOpened&&(r=!0,n={pageX:t.pageX,pageY:t.pageY},i.touchMove(s,n),i.LGel.trigger(D))}),C(window).on("mouseup.lg.global"+this.lgId,function(t){var e;i.lgOpened&&(e=C(t.target),r?(r=!1,i.touchEnd(n,s,t),i.LGel.trigger(z)):i.isPosterElement(e)&&i.LGel.trigger(v),o&&(o=!1,i.outer.removeClass("lg-grabbing").addClass("lg-grab")))}))},t.prototype.manageSwipeClass=function(){var t=this.index+1,e=this.index-1;this.settings.loop&&2<this.galleryItems.length&&(0===this.index?e=this.galleryItems.length-1:this.index===this.galleryItems.length-1&&(t=0)),this.outer.find(".lg-item").removeClass("lg-next-slide lg-prev-slide"),-1<e&&this.getSlideItem(e).addClass("lg-prev-slide"),this.getSlideItem(t).addClass("lg-next-slide")},t.prototype.goToNextSlide=function(t){var e=this,i=this.settings.loop;t&&this.galleryItems.length<3&&(i=!1),this.lgBusy||(this.index+1<this.galleryItems.length?(this.index++,this.LGel.trigger(G,{index:this.index}),this.slide(this.index,!!t,!1,"next")):i?(this.index=0,this.LGel.trigger(G,{index:this.index}),this.slide(this.index,!!t,!1,"next")):this.settings.slideEndAnimation&&!t&&(this.outer.addClass("lg-right-end"),setTimeout(function(){e.outer.removeClass("lg-right-end")},400)))},t.prototype.goToPrevSlide=function(t){var e=this,i=this.settings.loop;t&&this.galleryItems.length<3&&(i=!1),this.lgBusy||(0<this.index?(this.index--,this.LGel.trigger(M,{index:this.index,fromTouch:t}),this.slide(this.index,!!t,!1,"prev")):i?(this.index=this.galleryItems.length-1,this.LGel.trigger(M,{index:this.index,fromTouch:t}),this.slide(this.index,!!t,!1,"prev")):this.settings.slideEndAnimation&&!t&&(this.outer.addClass("lg-left-end"),setTimeout(function(){e.outer.removeClass("lg-left-end")},400)))},t.prototype.keyPress=function(){var e=this;C(window).on("keydown.lg.global"+this.lgId,function(t){e.lgOpened&&!0===e.settings.escKey&&27===t.keyCode&&(t.preventDefault(),e.settings.allowMediaOverlap&&e.outer.hasClass("lg-can-toggle")&&e.outer.hasClass("lg-components-open")?e.outer.removeClass("lg-components-open"):e.closeGallery()),e.lgOpened&&1<e.galleryItems.length&&(37===t.keyCode&&(t.preventDefault(),e.goToPrevSlide()),39===t.keyCode&&(t.preventDefault(),e.goToNextSlide()))})},t.prototype.arrow=function(){var t=this;this.getElementById("lg-prev").on("click.lg",function(){t.goToPrevSlide()}),this.getElementById("lg-next").on("click.lg",function(){t.goToNextSlide()})},t.prototype.arrowDisable=function(t){var e,i;!this.settings.loop&&this.settings.hideControlOnEnd&&(e=this.getElementById("lg-prev"),i=this.getElementById("lg-next"),t+1<this.galleryItems.length?e.removeAttr("disabled").removeClass("disabled"):e.attr("disabled","disabled").addClass("disabled"),0<t?i.removeAttr("disabled").removeClass("disabled"):i.attr("disabled","disabled").addClass("disabled"))},t.prototype.setTranslate=function(t,e,i,s,n){void 0===s&&(s=1),void 0===n&&(n=1),t.css("transform","translate3d("+e+"px, "+i+"px, 0px) scale3d("+s+", "+n+", 1)")},t.prototype.mousewheel=function(){var e=this;this.outer.on("mousewheel.lg",function(t){!t.deltaY||e.galleryItems.length<2||(0<t.deltaY?e.goToPrevSlide():e.goToNextSlide(),t.preventDefault())})},t.prototype.isSlideElement=function(t){return t.hasClass("lg-outer")||t.hasClass("lg-item")||t.hasClass("lg-img-wrap")},t.prototype.isPosterElement=function(t){var e=this.getSlideItem(this.index).find(".lg-video-play-button").get();return t.hasClass("lg-video-poster")||t.hasClass("lg-video-play-button")||e&&e.contains(t.get())},t.prototype.toggleMaximize=function(){var t=this;this.getElementById("lg-maximize").on("click.lg",function(){t.$container.toggleClass("lg-inline"),t.refreshOnResize()})},t.prototype.invalidateItems=function(){for(var t=0;t<this.items.length;t++){var e=C(this.items[t]);e.off("click.lgcustom-item-"+e.attr("data-lg-id"))}},t.prototype.manageCloseGallery=function(){var e,i=this;this.settings.closable&&(e=!1,this.getElementById("lg-close").on("click.lg",function(){i.closeGallery()}),this.settings.closeOnTap&&(this.outer.on("mousedown.lg",function(t){t=C(t.target);e=!!i.isSlideElement(t)}),this.outer.on("mousemove.lg",function(){e=!1}),this.outer.on("mouseup.lg",function(t){t=C(t.target);i.isSlideElement(t)&&e&&(i.outer.hasClass("lg-dragging")||i.closeGallery())})))},t.prototype.closeGallery=function(t){var e=this;if(!this.lgOpened||!this.settings.closable&&!t)return 0;this.LGel.trigger(k),C(window).scrollTop(this.prevScrollTop);var i,s,n=this.items[this.index];this.zoomFromOrigin&&n&&(i=(o=this.mediaContainerPosition).top,t=o.bottom,o=I(n,this.$lgContent,i+t,this.galleryItems[this.index].__slideVideoInfo&&this.settings.videoMaxSize),s=l(n,this.$lgContent,i,t,o)),this.zoomFromOrigin&&s?(this.outer.addClass("lg-closing lg-zoom-from-image"),this.getSlideItem(this.index).addClass("lg-start-end-progress").css("transition-duration",this.settings.startAnimationDuration+"ms").css("transform",s)):(this.outer.addClass("lg-hide-items"),this.outer.removeClass("lg-zoom-from-image")),this.destroyModules(),this.lGalleryOn=!1,this.isDummyImageRemoved=!1,this.zoomFromOrigin=this.settings.zoomFromOrigin,clearTimeout(this.hideBarTimeout),this.hideBarTimeout=!1,C("html").removeClass("lg-on"),this.outer.removeClass("lg-visible lg-components-open"),this.$backdrop.removeClass("in").css("opacity",0);var o=this.zoomFromOrigin&&s?Math.max(this.settings.startAnimationDuration,this.settings.backdropDuration):this.settings.backdropDuration;return this.$container.removeClass("lg-show-in"),setTimeout(function(){e.zoomFromOrigin&&s&&e.outer.removeClass("lg-zoom-from-image"),e.$container.removeClass("lg-show"),e.$backdrop.removeAttr("style").css("transition-duration",e.settings.backdropDuration+"ms"),e.outer.removeClass("lg-closing "+e.settings.startClass),e.getSlideItem(e.index).removeClass("lg-start-end-progress"),e.$inner.empty(),e.lgOpened&&e.LGel.trigger(A,{instance:e}),e.outer.get()&&e.outer.get().blur(),e.lgOpened=!1},o+100),o+100},t.prototype.initModules=function(){this.plugins.forEach(function(t){try{t.init()}catch(t){console.warn("lightGallery:- make sure lightGallery module is properly initiated")}})},t.prototype.destroyModules=function(e){this.plugins.forEach(function(t){try{e?t.destroy():t.closeGallery&&t.closeGallery()}catch(t){console.warn("lightGallery:- make sure lightGallery module is properly destroyed")}})},t.prototype.refresh=function(t){this.settings.dynamic||this.invalidateItems(),this.galleryItems=t||this.getItems(),this.openGalleryOnItemClick(),this.updateCounterTotal(),this.manageSingleSlideClassName(),this.LGel.trigger(d)},t.prototype.destroy=function(){var t=this,e=this.closeGallery(!0);setTimeout(function(){t.destroyModules(!0),t.settings.dynamic||t.invalidateItems(),C(window).off(".lg.global"+t.lgId),t.LGel.off(".lg"),t.$container.remove()},e)},t);function t(t,e){if(this.lgOpened=!1,this.index=0,this.plugins=[],this.lGalleryOn=!1,this.lgBusy=!1,this.currentItemsInDom=[],this.prevScrollTop=0,this.isDummyImageRemoved=!1,this.mediaContainerPosition={top:0,bottom:0},!t)return this;if(B++,this.lgId=B,this.el=t,this.LGel=C(t),this.generateSettings(e),this.buildModules(),this.settings.dynamic&&void 0!==this.settings.dynamicEl&&!Array.isArray(this.settings.dynamicEl))throw"When using dynamic mode, you must also define dynamicEl as an Array.";return this.galleryItems=this.getItems(),this.normalizeSettings(),this.init(),this.validateLicense(),this}return function(t,e){return new P(t,e)}});
