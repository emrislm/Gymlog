import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to) => {
	const { pb } = await useAuth();

	if (!pb.authStore.isValid && to.name !== "auth-login" && to.name !== "auth-register") {
		console.log("not valid, redirecting to login");
		return navigateTo("/auth/login", { redirectCode: 401 });
	}
});
