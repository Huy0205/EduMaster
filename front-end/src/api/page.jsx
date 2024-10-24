import axios from "axios";
var api = axios.create({
     baseURL: 'http://localhost:8080/api/v1/'
});
export const postApiNoneToken = (url, data) => {
    return api.post(url, data);
};