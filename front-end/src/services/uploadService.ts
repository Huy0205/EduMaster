import axios from '~/util/axios.customize';

export class UploadService {
    public static uploadQuestionImage(file: File) {
        const formData = new FormData();
        formData.append('file', file); // Thêm file vào formData
        return axios.post('upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
}
