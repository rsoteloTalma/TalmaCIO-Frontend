import { callAPI } from '../network';


export async function getData(params: any): Promise<any> {
    const data = await callAPI(
        null,
        "", 'get');
        //`EndPoint?${params}`, 'get');

    return data || [];
}


export async function postData(params: any): Promise<any> {
    const data = await callAPI(
        params,
        "Endpoint", "post");
    return data;
}
