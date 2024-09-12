import axios, {
  AxiosError,
  AxiosInstance,
  AxiosProgressEvent,
  AxiosResponse,
  isAxiosError,
} from 'axios';
// Axios instances
const client = axios.create({
  // konfigurasi Axios client dengan token

  baseURL: 'https://expapi.kelaspintar.dev', // Base URL untuk semua request
  headers: {
    Authorization: `Bearer compressed_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzU2NDMzLCJ1dWlkIjoiZmZjYzQwMmMtMzYxMS00Y2U4LWFkNDEtZWNlYjZkNDFmMmE5IiwiY29udGV4dCI6eyJ1c2VyIjp7Im5hbWUiOiJZRlIgQXN0ZXJpYSBEd2kgV2FzYW5hd2F0aSIsImF2YXRhciI6Imh0dHBzOi8vc3RvcmFnZS5nb29nbGVhcGlzLmNvbS9rcF9yZWJvcm5fYnVja2V0L2tlbGFzX3BpbnRhci8iLCJlbWFpbCI6Imd1cnUxM0BzbWFmb25zdml0YWUxLmtwLmlkIn19LCJhdWQiOiJrcC1qaXRzaS1kZXYiLCJpc3MiOiJrcC1qaXRzaS1kZXYiLCJzdWIiOiJtZWV0LmtlbGFzcGludGFyLmRldiIsInJvb20iOiIqIiwiZXhwIjoxNzgxOTg0OTQwfQ.tmrVTsDqwRwZu7FXccbq1-jaYR6g1eVZSPE3U0ZccXc`, // Tambahkan Bearer token di header untuk autentikasi
  },
});

const apiWithoutToken = axios.create({
  // konfigurasi Axios tanpa token
});

const getAxios = (props: ApiProps): AxiosInstance => {
  return props?.withoutToken ? apiWithoutToken : client;
};

const abortSignal = () => {
  const controller = new AbortController();
  return controller.signal;
};

// Logging functions
const logApi = (logData: any) => {
  console.log('API Log: ', logData);
};

const sendApiLog = (
  axiosResponse: AxiosResponse | AxiosError,
  props: ApiProps
) => {
  const { body, sendLog } = props;
  if (sendLog?.logType === 'INFO') {
    sendLog({
      feature: 'api',
      data: body,
      headers: (axiosResponse as AxiosResponse).headers,
      url: axiosResponse.config?.url,
    });
  } else {
    sendErrorLog({
      feature: 'api',
      logId: (axiosResponse as AxiosError).response?.data?.log_id || '',
      body,
      headers: (axiosResponse as AxiosError).config?.headers,
      url: axiosResponse.config?.url,
      errorResponse: (axiosResponse as AxiosError).response?.data?.toString(),
    });
  }
};

const sendErrorLog = (errorLog: any) => {
  console.error('API Error Log: ', errorLog);
};

const sendLog = (logData: any) => {
  console.log('General Log: ', logData);
};

// TypeScript types
interface ApiProps {
  url: string;
  headers?: any;
  config?: any;
  withoutToken?: boolean;
  fullResponse?: boolean;
  resHeaders?: boolean;
  tags?: string[];
  sendLog?: {
    logType: string;
  };
  retry?: number;
  onTimeout?: () => void;
  fullErrorResponse?: boolean;
}

// Main apiGet function
const apiGet: <T = any>(props: ApiProps) => Promise<T> = async (
  props: ApiProps
) => {
  try {
    const fullResponse = props?.fullResponse ?? false;
    const resHeaders = props?.resHeaders ?? false;
    const res = await getAxios(props).get(props?.url, {
      ...props.config,
      headers: props?.headers,
      signal: abortSignal(),
    });
    logApi({
      nameFunction: 'apiGet',
      tags: props?.tags,
      res: res,
    });
    return Promise.resolve(
      fullResponse ? res?.data : resHeaders ? res?.headers : res?.data?.data
    );
  } catch (e: any) {
    props.sendLog?.type.some((item: string) => item === 'ERROR') &&
      sendApiLog(e, {
        ...props,
        sendLog: { ...props.sendLog, logType: 'ERROR' },
      });
    if (props.onTimeout && isAxiosError(e)) {
      if (e.code === AxiosError.ERR_CANCELED) {
        props.onTimeout();
      }
    }
    if ((props.retry ?? 0) > 0) {
      return await apiGet({
        ...props,
        retry: props.retry ? props.retry - 1 : 0,
      });
    }
    logApi({
      nameFunction: 'apiGet',
      tags: props?.tags,
      e: e,
    });
    const errorData = e?.response?.data?.message || 'Terjadi Kesalahan';
    return props.fullErrorResponse
      ? Promise.reject(e)
      : Promise.reject(errorData);
  }
};
