import axios from "axios";
import { saveAs } from 'file-saver';

const sendMessageToSupport = (content) => {
    return axios.post('/others/send-message-to-support',  {
        content
    });
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
        pl: 'Opłać zamówienie',
        en: 'Opłać zamówienie',
        link: '/oplac-zamowienie'
    },
    {
        pl: 'Szczegóły',
        en: 'Details',
        link: '/zamowienie'
    },
    {
        pl: 'Zweryfikuj but na miarę',
        en: 'Zweryfikuj but na miarę',
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

const isPasswordStrong = (pass) => {
    return pass?.length >= 8;
}

async function downloadData(files, formContent, orderId) {
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
        saveAs(content, `zamowienie-${orderId}.zip`);
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

export { scrollToTop, isPasswordStrong, sendMessageToSupport, isEmail, getDate, sendContactForm, isElementInArray,
    statusButtons, groupBy, getNumberOfFirstTypeForms, getNumberOfSecondTypeForms, downloadData, getFiletype, getTime}
