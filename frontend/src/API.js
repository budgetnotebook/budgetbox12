import axios from 'axios';
const LOGIN_USER_KEY = 'BUDGET_BOX_LOGIN_USER_KEY';

var baseURL;
if (process.env.REACT_APP_ENVIRONMENT && process.env.REACT_APP_ENVIRONMENT === 'PRODUCTION') {
    baseURL = process.env.REACT_APP_API_BASE_URL;
} else {
    baseURL = 'http://127.0.0.1:8000';
}

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Add requireToken: true in request config, for API that required Authorization token
 */
api.interceptors.request.use(
    config => {
        if (config.requireToken && localStorage.getItem(LOGIN_USER_KEY)) {
            config.headers.common['Authorization'] = JSON.parse(localStorage.getItem(LOGIN_USER_KEY)).token;
        }

        return config;
    },
    err => {
        console.error(err);
    }
);

api.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        if (error.response.status === 401) {
            localStorage.removeItem(LOGIN_USER_KEY);
        }
        return Promise.reject(error);
    }
);

export default class API {
    signUp = async signUpBody => {
        const formData = new FormData();

        for (const key in signUpBody) {
            formData.append(key, signUpBody[key]);
        }
        return api.post('/users/signup/', formData);
    };
    signIn = async signInBody => {
        const formData = new FormData();

        for (const key in signInBody) {
            formData.append(key, signInBody[key]);
        }
        return api.post('/users/signin/', formData);
    };
    updateProfile = async (updateProfileBody, id) => {
        const formData = new FormData();
        for (const key in updateProfileBody) {
            formData.append(key, updateProfileBody[key]);
        }
        return api.put(`/users/update/${id}`, formData, { requireToken: true });
    };
}
