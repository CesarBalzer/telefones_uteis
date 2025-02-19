import Module from './module';

export class Ipva extends Module {
	fetch(id: string) {
		return this.get(`/vehicle/${id}/ipva`);
	}
}
