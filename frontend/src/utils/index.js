import axios from 'axios';
import { apiBase } from '../config';

export function get(path, params, jwt = '') {
  const url = `${apiBase}${path}`;
  const headers = {};
  if(jwt) headers.Authorization = `Bearer ${jwt}`
  return axios({
    method: 'get',
    url,
    params,
    headers,
    withCredentials: true,
  }).then(resp => resp.data);
}

export function post(path, data, params, jwt = '') {
  const url = `${apiBase}${path}`;
  const headers = {};
  if(jwt) headers.Authorization = `Bearer ${jwt}`
  return axios({
    method: 'post',
    url,
    data,
    params,
    headers,
    withCredentials: true,
  }).then(resp => resp.data);
}

export function deleteOne(path, data, jwt = '') {
  const url = `${apiBase}${path}`;
  const headers = {};
  if(jwt) headers.Authorization = `Bearer ${jwt}`
  return axios({
    method: 'delete',
    url,
    data,
    headers,
    withCredentials: true,
  }).then(resp => resp.data);
}

export function putOne(path, data, jwt = '') {
  const url = `${apiBase}${path}`;
  const headers = {};
  if(jwt) headers.Authorization =  `Bearer ${jwt}`
  return axios({
    method: 'put',
    url,
    data,
    headers,
    withCredentials: true,
  }).then(resp => resp.data);
}