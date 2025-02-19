import Module from './module';

export class Dpvat extends Module {
	fetch(id: string) {
		return this.get(`/vehicle/${id}/dpvat`);
	}
}
