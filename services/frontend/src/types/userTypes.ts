export interface AuthUser {
	id: string;
	email: string;
	name: string;
	lastNames: string;
	avatarUrl: string | null;
	coordinates: {
		lat: number | null;
		lng: number | null;
	};
}
