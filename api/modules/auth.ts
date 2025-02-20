import Module from './module';

export class Auth extends Module {
  login(email: string, password: string) {
    return this.post('api/auth/login', {
      email,
      password,
    });
  }

  register(params: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    return this.post('api/auth/register', params);
  }
  fetchFromAPI({
    lastSync,
    page,
    perPage,
  }: {
    lastSync: string | null;
    page: number;
    perPage: number;
  }) {
    return this.get(
      `api/app/sync?lastSync=${lastSync ?? ''}&page=${page}&perPage=${perPage}`
    );
  }
}
