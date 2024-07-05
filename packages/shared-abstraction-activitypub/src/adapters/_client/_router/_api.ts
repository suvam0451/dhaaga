import axios from 'axios';

class DhaagaHttp {
	get<T>(path: string): Promise<T> {
		return axios.get(path).then((o) => o.data);
	}
}
