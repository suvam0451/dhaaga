export namespace dashboard {
	
	export class SearchUsersQuery {
	    query: string;
	    favouritedOnly: boolean;
	    limit: number;
	
	    static createFrom(source: any = {}) {
	        return new SearchUsersQuery(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.query = source["query"];
	        this.favouritedOnly = source["favouritedOnly"];
	        this.limit = source["limit"];
	    }
	}

}

export namespace threadsapi {
	
	export class ThreadsApi_Caption {
	    text: string;
	
	    static createFrom(source: any = {}) {
	        return new ThreadsApi_Caption(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.text = source["text"];
	    }
	}
	export class ThreadsApi_Post_ImageVersions2_Candidates {
	    height: number;
	    url: string;
	    width: number;
	
	    static createFrom(source: any = {}) {
	        return new ThreadsApi_Post_ImageVersions2_Candidates(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.height = source["height"];
	        this.url = source["url"];
	        this.width = source["width"];
	    }
	}
	export class ThreadsApi_Post_ImageVersions2 {
	    candidates: ThreadsApi_Post_ImageVersions2_Candidates[];
	
	    static createFrom(source: any = {}) {
	        return new ThreadsApi_Post_ImageVersions2(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.candidates = this.convertValues(source["candidates"], ThreadsApi_Post_ImageVersions2_Candidates);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ThreadsApi_ShareInfo {
	    quoted_post?: ThreadsApi_Post;
	    reposted_post?: ThreadsApi_Post;
	
	    static createFrom(source: any = {}) {
	        return new ThreadsApi_ShareInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.quoted_post = this.convertValues(source["quoted_post"], ThreadsApi_Post);
	        this.reposted_post = this.convertValues(source["reposted_post"], ThreadsApi_Post);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ThreadsApi_Post_TextPostAppInfo {
	    share_info: ThreadsApi_ShareInfo;
	
	    static createFrom(source: any = {}) {
	        return new ThreadsApi_Post_TextPostAppInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.share_info = this.convertValues(source["share_info"], ThreadsApi_ShareInfo);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
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
	export class ThreadsApi_Post {
	    pk: string;
	    id: string;
	    user: ThreadsApi_User;
	    code: string;
	    original_height: number;
	    original_width: number;
	    has_audio: boolean;
	    taken_at: number;
	    text_post_app_info: ThreadsApi_Post_TextPostAppInfo;
	    image_versions2: ThreadsApi_Post_ImageVersions2;
	    caption: ThreadsApi_Caption;
	    like_count: number;
	
	    static createFrom(source: any = {}) {
	        return new ThreadsApi_Post(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.pk = source["pk"];
	        this.id = source["id"];
	        this.user = this.convertValues(source["user"], ThreadsApi_User);
	        this.code = source["code"];
	        this.original_height = source["original_height"];
	        this.original_width = source["original_width"];
	        this.has_audio = source["has_audio"];
	        this.taken_at = source["taken_at"];
	        this.text_post_app_info = this.convertValues(source["text_post_app_info"], ThreadsApi_Post_TextPostAppInfo);
	        this.image_versions2 = this.convertValues(source["image_versions2"], ThreadsApi_Post_ImageVersions2);
	        this.caption = this.convertValues(source["caption"], ThreadsApi_Caption);
	        this.like_count = source["like_count"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	
	

}

export namespace utils {
	
	
	export class PostImageDTO {
	    asset_url: string;
	    post_id: string;
	
	    static createFrom(source: any = {}) {
	        return new PostImageDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.asset_url = source["asset_url"];
	        this.post_id = source["post_id"];
	    }
	}

}

