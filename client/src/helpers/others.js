import axios from "axios";
import { saveAs } from 'file-saver';

const sendMessageToSupport = (content) => {
    return axios.post('/others/send-message-to-support',  {
        content
    });
}

const displayPrice = (price) => {
    return price?.toString()?.length === 4 ? `${price.toString()[0]} ${price.toString().slice(1, 4)}` : price;
}

const getDate = (str) => {
    if(str) {
        const date = str.substring(0, 10);
        return date.substring(8, 10) + '.' + date.substring(5, 7) + '.' + date.substring(0, 4);
    }
    else {
        return '';
    }
}

function isInteger(str) {
    if (typeof str !== 'string') {
        return false;
    }

    const num = Number(str);

    return Number.isInteger(num) && num >= 0 && !(/.*\.+.*/).test(str);
}

const isAlphanumeric = (str) => {
    const re = new RegExp(/^[a-z0-9]+$/i);
    return re.test(str);
}

const validatePhoneNumberChange = (str) => {
    if(str.length <= 12) {
        if(str.length) {
            const lastChar = str[str.length-1];
            if(lastChar === ' ') {
                return false;
            }
            else {
                if(str.length === 1) {
                    return !!(isInteger(lastChar) || lastChar === '+');
                }
                else {
                    return !!(isInteger(lastChar));
                }
            }
        }
        else {
            return true;
        }
    }
    return false;
}

const isPostalCode = (str) => {
    return str.match(/\d{2}-\d{3}/);
}

const validatePostalCodeChange = (prevPostalCode, str) => {
    const l = str.length;

    if(l === 1 || l === 2) {
        if(prevPostalCode.length === 3) {
            // Backspace
            return str;
        }
        else {
            if(isInteger(str)) {
                if(l === 2) {
                    return `${str}-`;
                }
                else {
                    return str;
                }
            }
            else {
                return str.slice(0, -1);
            }
        }
    }
    else if(l === 3) {
        if(str.charAt(2) === '-') {
            return str;
        }
        else {
            return str.slice(0, -1);
        }
    }
    else if(l === 4 || l === 5 || l === 6) {
        const secondPart = str.slice(3);
        if(isInteger(secondPart)) {
            return str;
        }
        else {
            return str.slice(0, -1);
        }
    }
    else if(l > 6) {
        if(isPostalCode(str.slice(0, 6))) {
            return str.slice(0, 6);
        }
        else {
            return '';
        }
    }
    else {
        return str;
    }
}

const getTime = (str) => {
    if(str) {
        return str.substring(11, 19);
    }
    else {
        return '';
    }
}

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

const isEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

const sendContactForm = (name, email, message) => {
    return axios.post('/others/send-contact-form', {
        name, email, message
    });
}

const statusButtons = [
    {
        pl: 'Podaj wymiary stopy',
        en: 'Podaj wymiary stopy',
        link: '/formularz-mierzenia-stopy'
    },
    {
        pl: 'Zamawiam i płacę',
        en: 'Zamawiam i płacę',
        link: '/oplac-zamowienie'
    },
    {
        pl: 'Szczegóły',
        en: 'Details',
        link: '/zamowienie'
    },
    {
        pl: 'Zweryfikuj but do miary',
        en: 'Zweryfikuj but do miary',
        link: '/formularz-weryfikacji-buta'
    },
    {
        pl: 'Szczegóły',
        en: 'Details',
        link: '/zamowienie'
    },
    {
        pl: 'Szczegóły',
        en: 'Details',
        link: '/zamowienie'
    },
    {
        pl: 'Szczegóły',
        en: 'Details',
        link: '/zamowienie'
    },
    {
        pl: 'Szczegóły',
        en: 'Details',
        link: '/zamowienie'
    }
]

const groupBy = (items, key) => items.reduce(
    (result, item) => ({
        ...result,
        [item[key]]: [
            ...(result[item[key]] || []),
            item,
        ],
    }),
    {},
)

const getNumberOfFirstTypeForms = (cart) => {
    const groupedByType = Object.entries(groupBy(cart, 'type'));
    return groupedByType.map((item) => {
        return item[0];
    });
}

const getNumberOfSecondTypeForms = (cart) => {
    const groupedByModel = Object.entries(groupBy(cart, 'product'));
    return groupedByModel.map((item) => {
        return item[0];
    });
}

const isElementInArray = (el, arr) => {
    return arr.findIndex((item) => {
        return item === el;
    }) !== -1;
}

const getNumberOfOptionInCart = (optionId, cart) => {
    const cartAmounts = cart.map((item) => (item.amount));

    return cart.map((item, parentIndex) => (
            Object.entries(item.addons)
            .map((item, index) => ({
                optionId: item[1],
                amount: cartAmounts[parentIndex]
            }))
            .filter((item) => (item.optionId === optionId))
        ))
        .reduce((prev, curr) => {
            return prev + curr.length * (curr?.length ? curr[0].amount : 0);
        }, 0);
}

const isAddonAvailable = (addonOption, addonOptionStock, cart) => {
    return addonOptionStock - getNumberOfOptionInCart(addonOption, cart) > 0;
}

const isProductAvailable = (addons, stock, modelId, stockId, cart) => {
    /*
        Product is available if:
        - model has: stock - number of models with that stock in cart > 0
        - at least one option of every addon has: stock - number of options in cart > 0
     */

    /*
        addons: [
            {
                addon_id,
                addon_option_id,
                addon_option_stock
            }
        ]
     */

    if(cart) {
        return (addons.filter((item) => {
            const currentAddonId = item.addon_id;
            return addons
                .filter((item) => {
                    return item.addon_id === currentAddonId;
                })
                .findIndex((item) => {
                    return (item.addon_option_stock - getNumberOfOptionInCart(item.addon_option_id, cart) > 0);
                }) !== -1;
        }).length === addons.length) && (stock - getNumberOfModelsWithTheSameStockInCart(stockId, cart) > 0);
    }
    else {
        return 0;
    }
}

const getNumberOfModelsWithTheSameStockInCart = (stockId, cart) => {
    return cart.filter((item) => (item.stockId === stockId))
        .map((item) => (item.amount))
        .reduce((prev, curr) => {
            return prev + curr;
        }, 0);
}

const isPasswordStrong = (pass) => {
    return pass?.length >= 8;
}

async function downloadData(files, formContent, orderId, secondForm = false) {
    const zip = require('jszip')();
    let img = zip.folder('zdjecia');
    zip.file('formularz.txt', formContent.join('\n'));

    for(const file of files) {
        // Fetch the image and parse the response stream as a blob
        const imageBlob = await fetch(file.url).then(response => response.blob());

        // create a new file from the blob object
        const imgData = new File([imageBlob], 'filename.jpg');

        // Copy-pasted from JSZip documentation
        const filetype = getFiletype(imageBlob.type);
        img.file(`${file.name}.${filetype}`, imgData, { base64: true });
    }

    zip.generateAsync({ type: 'blob' }).then(function(content) {
        saveAs(content, `zamowienie-${orderId}${secondForm ? '-formularz-weryfikacji-buta' : ''}.zip`);
    });
}

const getFiletype = (mimetype) => {
    if(mimetype.indexOf("jpeg") > -1) {
        return 'jpeg';
    }
    else if(mimetype.indexOf('png') > -1) {
        return 'png';
    }
    else if(mimetype.indexOf('jpg') > -1) {
        return 'jpg';
    }
    else if(mimetype.indexOf('web') > -1) {
        return 'webp';
    }
    else if(mimetype.indexOf('tiff') > -1) {
        return 'tiff';
    }
    else if(mimetype.indexOf('bmp') > -1) {
        return 'bmp';
    }
    else {
        return 'gif';
    }
}

const createSlug = (name) => {
    if(name) return name.toLowerCase()
        .replace(/ /g, "-")
        .replace(/ą/g, "a")
        .replace(/ć/g, "c")
        .replace(/ę/g, "e")
        .replace(/ł/g, "l")
        .replace(/ń/g, "n")
        .replace(/ó/g, "o")
        .replace(/ś/g, "s")
        .replace(/ź/g, "z")
        .replace(/ż/g, "z")
    else return "";
}

export { scrollToTop, isPasswordStrong, sendMessageToSupport, isProductAvailable, isAddonAvailable,
    getNumberOfOptionInCart, isEmail, getDate, sendContactForm, isInteger, isAlphanumeric,
    isElementInArray, validatePhoneNumberChange, statusButtons, displayPrice, groupBy, getNumberOfFirstTypeForms,
    getNumberOfModelsWithTheSameStockInCart, getNumberOfSecondTypeForms, downloadData,
    getFiletype, getTime, validatePostalCodeChange, createSlug}
