export interface UserState {
	user: {
		searchTerm: string;
		page: number;
	};
}

export interface PostState {
	post: {
		page: number;
	};
}

export interface Reply {
	id: string;
	post: number;
	author_username: string;
	avatar: string;
	body: string;
	created_at: string;
	updated_at: string;
}

interface Post {
	id: string;
	title: string;
	slug: string;
	body: string;
	tags: string[];
	author_username: string;
	is_bookmarked: boolean;
	created_at: string;
	updated_at: string;
	view_count: number;
	upvotes: number;
	downvotes: number;
	is_upvoted: boolean;
	replies_count: number;
	avatar: string;
	replies: Reply[];
}

export interface PostsResponse {
	posts: {
		count: number;
		next: null | string;
		previous: null | string;
		results: Post[];
	};
}

export interface MyPostsResponse {
	my_posts: {
		count: number;
		next: null | string;
		previous: null | string;
		results: Post[];
	};
}

export interface PostData {
	title: string;
	tags: string[];
	body: string;
}

export interface BookmarkResponse {
	message: string;
}

export interface UpvoteDownvoteResponse {
	message: string;
}
export interface ReplyData {
	body: string;
}
export interface ReplyPostData extends ReplyData {
	postId: string | undefined;
}
export interface ReplyResponse {
	reply: {
		id: string;
		post: number;
		author_username: string;
		body: string;
		created_at: string;
		updated_at: string;
	};
}
export interface UpdatePostData {
	postSlug: string;
	title: string;
	body: string;
}

export interface PostResponse {
	post: Post;
}

export interface PostsByTagResponse {
	posts_by_tag: {
		count: number;
		next: null | string;
		previous: null | string;
		results: Post[];
	};
}

export interface RepliesResponse {
	replies: {
		count: number;
		next: null | string;
		previous: null | string;
		results: Reply[];
	};
}

export interface BookmarkedPostsResponse {
	bookmarked_posts: {
		count: number;
		next: null | string;
		previous: null | string;
		results: Post[];
	};
}
interface TopPost {
	id: string;
	title: string;
	slug: string;
	author_username: string;
	upvotes: number;
	view_count: number;
	replies_count: number;
	avatar: string;
	created_at: string;
}

interface PopularTag {
	name: string;
	slug: string;
	post_count: number;
}

export interface PopularTagResponse {
	popular_tags: {
		count: number;
		next: null | string;
		previous: null | string;
		results: PopularTag[];
	};
}

export interface TopPostsResponse {
	top_posts: {
		count: number;
		next: null | string;
		previous: null | string;
		results: TopPost[];
	};
}
interface Report {
	id: string;
	title: string;
	description: string;
	created_at: string;
}

export interface MyReportsResponse {
	reports: {
		count: number;
		next: null | string;
		previous: null | string;
		results: Report[];
	};
}

export interface ReportTenantData {
	title: string;
	description: string;
	reported_user_username: string;
}

export interface ReportTenantResponse {
	report: Report;
}

export interface IssueData {
	title: string;
	description: string;
	status: "reported" | "resolved" | "in_progress";
	priority: "low" | "medium" | "high";
}

export interface ReportIssueData extends IssueData {
	apartmentId: string;
}

export interface Issue {
	id: string;
	apartment_unit: string;
	reported_by: string;
	title: string;
	description: string;
	status: "reported" | "resolved" | "in_progress";
	priority: "low" | "medium" | "high";
	view_count: number;
	assigned_to?: string;
}

export interface IssueResponse {
	issue: Issue;
}

export interface UpdateIssueResponse {
	issue: {
		title: string;
		description: string;
		apartment: string;
		reported_by: string;
		status: "reported" | "resolved" | "in_progress";
		resolved_by: string;
		resolved_on: string;
	};
}

export interface IssueStatusData {
	status: string;
}

export interface UpdateIssueData extends IssueStatusData {
	issueId: string;
}
export interface MyIssuesResponse {
	my_issues: {
		count: number;
		next?: string;
		previous?: string;
		results: Issue[];
	};
}

export interface MyAssignedIssuesResponse {
	assigned_issues: {
		count: number;
		next?: string;
		previous?: string;
		results: Issue[];
	};
}
export interface ApartmentData {
	unit_number: string;
	building: string;
	floor: number;
}

export interface ApartmentResponse {
	apartment: {
		id: string;
		created_at: string;
		unit_number: string;
		building: string;
		floor: number;
	};
}

export interface LeftNavLink {
	path: string;
	label: string;
	imgLocation: string;
}

export interface UserCommonData {
	email: string;
	password: string;
}

export interface User {
	first_name: string;
	last_name: string;
	email: string;
}

export interface UserResponse {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	username: string;
	slug: string;
	full_name: string;
	gender: string;
	occupation: string;
	phone_number: string;
	country: string;
	city: string;
	reputation: string;
	avatar: string;
	date_joined: string;
}
export interface RegisterUserData extends UserCommonData {
	username: string;
	first_name: string;
	last_name: string;
	re_password: string;
}

export interface LoginUserData extends UserCommonData {}

export interface ActivateUserData {
	uid: string;
	token: string;
}
export interface ResetPasswordConfirmData extends ActivateUserData {
	new_password: string;
	re_new_password: string;
}
export interface ResetPasswordData {
	email: string;
}

export interface RegisterUserResponse {
	id: string;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
}
export interface LoginResponse {
	message: string;
}
export interface SocialAuthArgs {
	provider: string;
	state: string;
	code: string;
}
export interface SocialAuthResponse {
	message: string;
	user: User;
}

export interface Profile {
	id: string;
	slug: string;
	first_name: string;
	last_name: string;
	username: string;
	full_name: string;
	gender: "male" | "female" | "other";
	country_of_origin: string;
	city_of_origin: string;
	bio?: string;
	occupation:
		| "mason"
		| "carpenter"
		| "plumber"
		| "roofer"
		| "painter"
		| "electrician"
		| "hvac"
		| "tenant";
	reputation: number;
	date_joined: string;
	avatar?: string;
	average_rating: number;
	apartment: {
		id: string;
		created_at: string;
		unit_number: string;
		building: string;
		floor: number;
	} | null;
}

export interface ProfilesResponse {
	profiles: {
		count: number;
		next?: string;
		previous?: string;
		results: Profile[];
	};
}
export interface RatingResponse {
	rating: {
		id: string;
		rating: number;
		comment: string;
	};
}
export interface RatingData {
	rated_user_username: string;
	rating: number;
	comment: string;
}
export interface NonTenantResponse {
	non_tenant_profiles: {
		count: number;
		next?: string;
		previous?: string;
		results: Profile[];
	};
}
export interface QueryParams {
	page?: number;
	searchTerm?: string;
}

export interface PostQueryParams {
	page?: number;
}

export interface ProfileResponse {
	profile: Profile;
}

export interface ProfileData {
	first_name: string;
	last_name: string;
	username: string;
	gender: "male" | "female" | "other";
	bio?: string;
	country_of_origin: string;
	city_of_origin: string;
	occupation:
		| "mason"
		| "carpenter"
		| "plumber"
		| "roofer"
		| "painter"
		| "electrician"
		| "hvac"
		| "tenant";
	phone_number: string;
}

export type Occupation =
	| "mason"
	| "carpenter"
	| "plumber"
	| "roofer"
	| "painter"
	| "electrician"
	| "hvac"
	| "tenant";
