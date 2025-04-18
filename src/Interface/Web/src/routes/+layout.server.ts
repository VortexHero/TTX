import type { LayoutServerLoad } from './$types';
import { getToken, getUserData, logout } from '$lib/auth';
import { getApiClient } from '$lib';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const user = getUserData(cookies);
	const token = getToken(cookies);
	const client = getApiClient(token ?? '');

	if (!user) {
		return {
			user,
			token
		};
	}

	try {
		const self = await client.getSelf();
		const liveHoldings = self.shares.map((s) => ({
			creator: s.creator.name,
			slug: s.creator.slug,
			avatar: s.creator.avatar_url,
			isLive: s.creator.stream_status.is_live
		}));

		return {
			user,
			token,
			liveHoldings
		};
	} catch (error) {
		logout(cookies);
		return {
			user,
			token,
		};
	}
};
