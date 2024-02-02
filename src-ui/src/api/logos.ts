import { Api } from "./api";

export class Logos {
    getLogoUrl(id: string) {
        return Api.getApiUrl(`logos/${id}/image`);
    }
}