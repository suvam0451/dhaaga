export namespace dashboard {
	
	export class SearchUsersQuery {
	    query: string;
	    favouritedOnly: boolean;
	    limit: number;
	    offset: number;
	
	    static createFrom(source: any = {}) {
	        return new SearchUsersQuery(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.query = source["query"];
	        this.favouritedOnly = source["favouritedOnly"];
	        this.limit = source["limit"];
	        this.offset = source["offset"];
	    }
	}
	export class SearchUsersResponse {
	    items: threadsapi.ThreadsApi_User[];
	    total: number;
	
	    static createFrom(source: any = {}) {
	        return new SearchUsersResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.items = this.convertValues(source["items"], threadsapi.ThreadsApi_User);
	        this.total = source["total"];
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
	export class ThreadsApi_PostVideoVersions_ArrayItem {
	    type: number;
	    url: string;
	    __typename: string;
	
	    static createFrom(source: any = {}) {
	        return new ThreadsApi_PostVideoVersions_ArrayItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.type = source["type"];
	        this.url = source["url"];
	        this.__typename = source["__typename"];
	    }
	}
	export class ThreadsApi_Post_ImageVersions2_Candidates {
	    height: number;
	    url: string;
	    width: number;
	    __typename: string;
	
	    static createFrom(source: any = {}) {
	        return new ThreadsApi_Post_ImageVersions2_Candidates(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.height = source["height"];
	        this.url = source["url"];
	        this.width = source["width"];
	        this.__typename = source["__typename"];
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
	    video_versions?: ThreadsApi_PostVideoVersions_ArrayItem[];
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
	        this.video_versions = this.convertValues(source["video_versions"], ThreadsApi_PostVideoVersions_ArrayItem);
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

export namespace threadsdb {
	
	export class ThreadsDb_Account {
	    id: number;
	    domain: string;
	    subdomain: string;
	    username: string;
	    password: string;
	    last_login_at?: string;
	    verified: boolean;
	
	    static createFrom(source: any = {}) {
	        return new ThreadsDb_Account(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.domain = source["domain"];
	        this.subdomain = source["subdomain"];
	        this.username = source["username"];
	        this.password = source["password"];
	        this.last_login_at = source["last_login_at"];
	        this.verified = source["verified"];
	    }
	}
	export class ThreadsDb_Credential {
	    id: number;
	    account_id: string;
	    credential_type: string;
	    credential_value: string;
	    updated_at: string;
	
	    static createFrom(source: any = {}) {
	        return new ThreadsDb_Credential(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.account_id = source["account_id"];
	        this.credential_type = source["credential_type"];
	        this.credential_value = source["credential_value"];
	        this.updated_at = source["updated_at"];
	    }
	}

}

export namespace utils {
	
	
	export class PostImageDTO {
	    asset_url: string;
	    post_id: string;
	    asset_type: string;
	    liked_local: boolean;
	    video_download_url?: string;
	
	    static createFrom(source: any = {}) {
	        return new PostImageDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.asset_url = source["asset_url"];
	        this.post_id = source["post_id"];
	        this.asset_type = source["asset_type"];
	        this.liked_local = source["liked_local"];
	        this.video_download_url = source["video_download_url"];
	    }
	}

}

