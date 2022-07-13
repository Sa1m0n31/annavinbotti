import axios from "axios";

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

export { scrollToTop, sendMessageToSupport, isEmail, getDate, sendContactForm,
    statusButtons, groupBy, getNumberOfFirstTypeForms, getNumberOfSecondTypeForms }
