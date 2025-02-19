import {AxiosInstance, AxiosRequestConfig} from 'axios';

export default class Module {
	private client: AxiosInstance;
	private prefix: string;

	constructor(client: AxiosInstance, prefix: string = '') {
		this.client = client;
		this.prefix = prefix;
	}

	protected get(endpoint: string, config?: AxiosRequestConfig) {
		return this.request('get', endpoint, config);
	}

	protected post(endpoint: string, data?: {}, config?: AxiosRequestConfig) {
		return this.request('post', endpoint, data, config);
	}

	protected put(endpoint: string, data?: {}, config?: AxiosRequestConfig) {
		return this.request('put', endpoint, data, config);
	}

	protected async request(method: 'get' | 'post' | 'put', endpoint: string, data?: {}, config?: AxiosRequestConfig) {
		let response = await this.client[method](this.prefix + endpoint, data, config);
		return response.data;
	}
}
