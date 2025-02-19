import Module from './module';

export class InfoVehicle extends Module {
	fetch(id: string) {
		return this.get(`/vehicle/${id}/info`);
	}
}
