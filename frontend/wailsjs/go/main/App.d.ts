// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {dashboard} from '../models';
import {threadsdb} from '../models';
import {utils} from '../models';
import {threadsapi} from '../models';

export function DashboardSearchUsers(arg1:dashboard.SearchUsersQuery):Promise<dashboard.SearchUsersResponse>;

export function GetAccount(arg1:string,arg2:string,arg3:string):Promise<threadsdb.ThreadsDb_Account>;

export function GetAccountsByDomain(arg1:string):Promise<Array<threadsdb.ThreadsDb_Account>>;

export function GetAccoutsBySubdomain(arg1:string,arg2:string):Promise<Array<threadsdb.ThreadsDb_Account>>;

export function GetAsset(arg1:string):Promise<string>;

export function GetCredentialsByAccountId(arg1:number):Promise<Array<threadsdb.ThreadsDb_Credential>>;

export function GetCustomDeviceId():Promise<string>;

export function GetDatabasePostInfo(arg1:string):Promise<utils.PostDetailsDTO>;

export function GetDownloadsFolder():Promise<string>;

export function GetImagesForProfile(arg1:string):Promise<Array<utils.PostImageDTO>>;

export function GetImagesFromThread(arg1:string):Promise<Array<utils.PostImageDTO>>;

export function GetSubdomainsForDomain(arg1:string):Promise<Array<string>>;

export function GetTextFeedUsingCursor(arg1:string,arg2:string,arg3:string):Promise<string>;

export function GetUserDataDirectory():Promise<string>;

export function InstagramSafeLogin(arg1:string,arg2:string):Promise<string>;

export function SearchUsers(arg1:string):Promise<Array<threadsapi.ThreadsApi_User>>;

export function SelectDownloadsFolder():Promise<string>;

export function SetCustomDeviceId(arg1:string):Promise<boolean>;

export function SetUserFavourite(arg1:string):Promise<void>;

export function UnsetUserFavourite(arg1:string):Promise<void>;

export function UpsertAccount(arg1:utils.ThreadsDb_Account_Create_DTO):Promise<boolean>;

export function UpsertCredential(arg1:threadsdb.ThreadsDb_Account,arg2:string,arg3:string):Promise<boolean>;
