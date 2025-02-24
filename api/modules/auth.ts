import Module from './module';

export class Auth extends Module {
  login(email: string, password: string) {
    return this.post('api/auth/login', {
      email,
      password,
    });
  }

  register(data: any) {
    return this.post('api/auth/register', data);
  }

  verificationCode(params: { email: string }) {
    return this.post('api/auth/send-verification-code', params);
  }

  update(params: {
    name: string;
    email: string;
    birthday: string;
    password: string;
    password_confirmation: string;
  }) {
    return this.post('api/me/update', params);
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

  toggleFavored(phoneId: number) {
    return this.post('api/favorites/toggle', { phone_id: phoneId });
  }

  favorites() {
    return this.get('api/favorites');
  }

  refresh() {
    return this.post('api/refresh');
  }

  logout() {
    return this.post('api/logout');
  }
}
