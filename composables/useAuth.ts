import PocketBase from "pocketbase";

const pb = new PocketBase("https://gymlog.pockethost.io/");

export const useAuth = async () => {
	const user = useState<any>("user", () => null);
	const router = useRouter();
	const cookie = useCookie("pb_auth", { secure: true });

	if (cookie.value) {
		try {
			pb.authStore.loadFromCookie(cookie.value || "");
		} catch (error) {
			console.error("Error loading cookie", error);
		}
	}

	pb.authStore.onChange(() => {
		cookie.value = pb.authStore.exportToCookie({ httpOnly: false });
	});

	const login = async (email: string, password: string) => {
		try {
			const authData = await pb.collection("users").authWithPassword(email, password);
			user.value = authData.record as any;

			pb.authStore.isValid && (await router.push("/"));

			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Authenticatie is niet gelukt",
			};
		}
	};

	const register = async (name: string, email: string, password: string, passwordConfirm: string) => {
		try {
			const data = {
				name,
				email,
				password,
				passwordConfirm,
			};
			await pb.collection("users").create(data);
			await login(email, password);
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Registratie is niet gelukt",
			};
		}
	};

	const logout = async () => {
		pb.authStore.clear();
		user.value = null;
		await router.push("/auth/login");
	};

	const addLog = async (log: any) => {
		try {
			console.log("addLog: log", log);
			await pb.collection("logs").create(log);
		} catch (error) {
			console.error("Error adding log", error);
		}
	};

	return {
		pb,
		user,
		login,
		register,
		logout,
		addLog,
	};
};
