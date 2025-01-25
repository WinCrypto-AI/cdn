import { configEnv } from '~/@config/env';
import { EMediaType, createHttpClient } from '~/@core/network';

const { CONNECTOR_APE_WMS_BASE_URL, CONNECTOR_APE_WMS_APIKEY } = configEnv();
export const optionalApiConnector = createHttpClient({
  baseURL: '',
  timeout: 2 * 60 * 1000,
  beforeRequest: config => {
    return config;
  },
  handleError: err => {
    return err;
  },
  handleResponse: async res => {
    return res.data;
  },
});

export const geoApiConnector = createHttpClient({
  baseURL: 'https://provinces.open-api.vn',
  timeout: 2 * 60 * 1000,
  beforeRequest: config => {
    config.headers['Content-Type'] = EMediaType.APPLICATION_JSON;
    config.headers['Accept'] = EMediaType.APPLICATION_JSON;
    return config;
  },
  handleError: err => {
    return err;
  },
  handleResponse: async res => {
    return res.data;
  },
});
