export namespace threadsapi {
	
	export class ThreadsApi_User {
	    pk: string;
	    id: string;
	    username: string;
	    is_verified: boolean;
	    profile_pic_url: string;
	
	    static createFrom(source: any = {}) {
	        return new ThreadsApi_User(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.pk = source["pk"];
	        this.id = source["id"];
	        this.username = source["username"];
	        this.is_verified = source["is_verified"];
	        this.profile_pic_url = source["profile_pic_url"];
	    }
	}

}

