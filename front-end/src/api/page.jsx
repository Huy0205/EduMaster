import axios from '~/util/axios.customize';
// var api = axios.create({
//     baseURL: 'http://localhost:8080/api/v1/',
// });
export const postApiNoneToken = (url, data) => {
    return axios.post(url, data);
};

export const getApiNoneToken = (url, data) => {
    return axios.get(url, data);
};
export const putApiNoneToken = (url, data) => {
    return axios.put(url, data);
};
