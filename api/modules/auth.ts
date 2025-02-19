import Module from './module';

export class Auth extends Module {
	login(email: string, password: string) {
		return this.post('/auth/login', {
			email,
			password
		});
	}

	register(params: {name: string; email: string; password: string; password_confirmation: string}) {
		return this.post('/auth/register', params);
	}

	logout() {
		return this.post('/auth/logout');
	}
}
