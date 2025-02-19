import Module from './module';

export class Payments extends Module {
	fetch(id: string) {
		return this.get(`/method`);
	}
}
