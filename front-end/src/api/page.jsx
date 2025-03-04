import axios from '~/util/axios.customize';

export const postApiNoneToken = (url, data) => {
    return axios.post(url, data);
};

export const getApiNoneToken = (url, data) => {
    return axios.get(url, data);
};
export const putApiNoneToken = (url, data) => {
    return axios.put(url, data);
};
