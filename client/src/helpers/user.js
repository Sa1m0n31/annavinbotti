import axios from "axios";

const getUserInfo = () => {
    return axios.get('/user/get-user-info', {
        withCredentials: true
    });
}

export { getUserInfo }
