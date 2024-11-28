import { usePB } from "~/composables/usePB";

export default defineNuxtRouteMiddleware(async (to) => {
	const { pb } = await usePB();

	if (!pb.authStore.isValid && to.name !== "auth-login" && to.name !== "auth-register") {
		console.log("not valid, redirecting to login");
		return navigateTo("/auth/login", { redirectCode: 401 });
	}
});
