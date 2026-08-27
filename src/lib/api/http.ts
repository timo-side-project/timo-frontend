import api from './instance';
import {
  type ApiRequestConfig,
  parseDataConfig,
  parseParamsConfig,
  parseWithSchema,
} from './schema';

export const get = async <TResponse, TParams = never>(
  url: string,
  config?: ApiRequestConfig<never, TParams, TResponse>,
): Promise<TResponse> => {
  const { params } = config ?? {};
  const { axiosConfig, parsedParams, responseSchema } = parseParamsConfig(
    params,
    config,
  );
  const response = await api.get<TResponse>(url, {
    ...axiosConfig,
    params: parsedParams,
  });

  return parseWithSchema(responseSchema, response.data);
};

export const post = async <TRequest, TResponse, TParams = never>(
  url: string,
  data?: TRequest,
  config?: ApiRequestConfig<TRequest, TParams, TResponse>,
): Promise<TResponse> => {
  const { axiosConfig, parsedData, parsedParams, responseSchema } =
    parseDataConfig(data, config);
  const response = await api.post<TResponse>(url, parsedData, {
    ...axiosConfig,
    params: parsedParams,
  });

  return parseWithSchema(responseSchema, response.data);
};

export const patch = async <TRequest, TResponse>(
  url: string,
  data?: TRequest,
  config?: ApiRequestConfig<TRequest, never, TResponse>,
): Promise<TResponse> => {
  const { axiosConfig, parsedData, responseSchema } = parseDataConfig(
    data,
    config,
  );
  const response = await api.patch<TResponse>(url, parsedData, axiosConfig);

  return parseWithSchema(responseSchema, response.data);
};

export const put = async <TRequest, TResponse>(
  url: string,
  data?: TRequest,
  config?: ApiRequestConfig<TRequest, never, TResponse>,
): Promise<TResponse> => {
  const { axiosConfig, parsedData, responseSchema } = parseDataConfig(
    data,
    config,
  );
  const response = await api.put<TResponse>(url, parsedData, axiosConfig);

  return parseWithSchema(responseSchema, response.data);
};

export const del = async <TRequest, TResponse>(
  url: string,
  data?: TRequest,
  config?: ApiRequestConfig<TRequest, never, TResponse>,
): Promise<TResponse> => {
  const { axiosConfig, parsedData, responseSchema } = parseDataConfig(
    data,
    config,
  );
  const response = await api.delete<TResponse>(url, {
    ...axiosConfig,
    data: parsedData,
  });

  return parseWithSchema(responseSchema, response.data);
};
