import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

export const generateMystery = (scenario) =>
  api.post('/mystery/generate', { scenario });

export const getMystery = (id) =>
  api.get(`/mystery/${id}`);

export const accuseSuspect = (id, suspectId) =>
  api.post(`/mystery/${id}/accuse`, { suspectId });
