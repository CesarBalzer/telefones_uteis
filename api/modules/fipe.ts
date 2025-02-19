import Module from './module';

export class Fipe extends Module {
	fetchBrands(vehicle_type: number) {
		return this.get(`/fipe/brands/${vehicle_type}`);
	}

	fetchModels(vehicle_type: number, brand_id: number) {
		return this.get(`/fipe/models/${vehicle_type}/${brand_id}`);
	}

	fetchYears(vehicle_type: number, brand_id: number, model_id: number) {
		return this.get(`/fipe/fuels/${vehicle_type}/${brand_id}/${model_id}`);
	}
}
