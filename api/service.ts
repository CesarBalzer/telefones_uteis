import axios, { AxiosInstance } from 'axios';
import { Auth, Dpvat, Fipe, Payments, Vehicle } from './modules';
import { Infraction } from './modules/infraction';
import { Ipva } from './modules/ipva';
import { InfoVehicle } from './modules/infoVehicle';
import StorageService from '../src/services/StorageService';

export default class Service {
  client: AxiosInstance;
  auth!: Auth;
  infraction!: Infraction;
  dpvat!: Dpvat;
  ipva!: Ipva;
  info!: InfoVehicle;
  vehicle!: Vehicle;
  payments!: Payments;
  fipe!: Fipe;

  private unauthenticatedCallbacks: (() => void)[] = [];

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
    });
    this.configureInterceptors(this.client);
    this.initializeModules(this.client);
  }

  private async handleUnauthorized() {
    console.log('Sessão Expirada');
    await StorageService.remove('token');
    this.unauthenticatedCallbacks.forEach((callback) => callback());
  }

  private configureInterceptors(instance: AxiosInstance) {
    instance.interceptors.request.use(
      async (config) => {
        const token = await StorageService.get('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      async (response) => {
        if (response.data && response.data.code === '1002') {
          await this.handleUnauthorized();
        }
        return response;
      },
      async (error) => {
        const { response } = error;
        if (response && response.data && response.data.code === '1002') {
          await this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  private initializeModules(client: AxiosInstance) {
    this.auth = new Auth(client);
    this.infraction = new Infraction(client);
    this.dpvat = new Dpvat(client);
    this.ipva = new Ipva(client);
    this.info = new InfoVehicle(client);
    this.vehicle = new Vehicle(client);
    this.payments = new Payments(client);
    this.fipe = new Fipe(client);
  }

  public onUnauthenticated(callback: () => void) {
    this.unauthenticatedCallbacks.push(callback);
  }
}
