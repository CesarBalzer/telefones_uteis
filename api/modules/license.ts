import Module from './module';

export class License extends Module {
	fetch(id: string) {
		return this.get(`/vehicle/${id}/licenciamento`);
	}
}
