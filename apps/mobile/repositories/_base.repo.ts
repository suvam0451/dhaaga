interface IRepository<T extends Object> {
	getAll();

	clearAll(): void;
}

abstract class BaseRepository<T extends Object, U> implements IRepository<T> {
	// protected readonly db: Realm;
	// protected readonly entity: string;
	// private readonly validator: ZodObject<any>;
	//
	// protected constructor(db: Realm, obj: string, validator: ZodObject<any>) {
	// 	this.db = db;
	// 	this.entity = obj;
	// 	this.validator = validator;
	// 	return this;
	// }

	/**
	 * cleans the input,
	 * @param obj
	 * @protected
	 */
	protected upsertImpl(obj: U) {
		try {
			// const input = this.validator.parse(obj);
			// return input as T;
		} catch (e) {
			// console.error(`[ERR]: ${this.entity} repo,`, e.errors);
		}
	}

	/**
	 * cleans the input,
	 * @param obj
	 * @protected
	 */
	protected createImpl(obj: U) {
		try {
			// const input = this.validator.parse(obj);
			// return this.db.create(this.entity, input);
		} catch (e) {
			// console.error(`[ERR]: ${this.entity} repo,`, e.errors);
		}
	}

	getAll() {
		// return this.db.objects(this.entity);
	}

	clearAll(): void {
		// this.db.delete(this.db.objects(this.entity));
	}
}

export default BaseRepository;
