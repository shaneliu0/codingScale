import firebase from 'firebase';

const auth = firebase.auth();

export const baseURL = "https://91d5d13c06d0.ngrok.io";

export const apiRequest = async (data:apiParams) => {
    console.log('Fetching!!!')
    let { route, payload, method } = data;

    method = method ?? 'GET';

    if (!auth.currentUser) throw new Error('Not signed in!')

    const token = await auth.currentUser.getIdToken(true);

    const options: any = {
        method: method ?? 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'authorization': token
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(payload ?? {}) // body data type must match "Content-Type" header
    }

    if (method === 'GET') {
        delete options.body;
    }

    const response = await fetch(baseURL + route, options)
    const json = await response.json();

    if (json.error) throw new Error(json.error);

    return json;
}

interface apiParams {
    route: string;
    payload?: any;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}