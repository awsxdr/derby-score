import axios from 'axios';

export class Api {
    private static readonly baseApiUrl = 'https://localhost:7148/api/';

    public static async get<TModel>(path: string) {
        return await axios.get<TModel>(this.getApiUrl(path));
    }

    public static async post<TModel>(path: string, model: TModel) {
        return await axios.post(this.getApiUrl(path), model);
    }

    public static getApiUrl(path: string) {
        return `${this.baseApiUrl}${path}`;
    }
}