import Module from './module';

export class Infraction extends Module {
	
	fetch(id: string) {
		return this.get(`/vehicle/${id}/multa`);
	}
}
