import axios from "axios";

const sendMessageToSupport = (content) => {
    return axios.post('/others/send-message-to-support',  {
        content
    });
}

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

export { scrollToTop, sendMessageToSupport }
