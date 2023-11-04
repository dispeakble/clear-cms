import axios from 'axios';

export const _baseURL = 'http://localhost:9090/api';

export const httpClient = axios.create({
  baseURL: _baseURL,
  timeout: 1000,
});
