import Module from './module';

export class Vehicle extends Module {
	fetch(id: string) {
		return this.get(`/vehicle/${id}`);
	}
	fetchAll() {
		return this.get(`/vehicle/all`);
	}
	fetchOrInsert(data: any) {
		return this.post(`/vehicle/consult`, data);
	}
}
