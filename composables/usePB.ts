import PocketBase from "pocketbase";
import type { Log } from "~/types/types";

const pb = new PocketBase("https://gymlog.pockethost.io/");

export const usePB = async () => {
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

	/* AUTH */
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

	/* LOGS */
	const getLogs = async (userId: string) => {
		try {
			const records = await pb.collection("logs").getFullList({
				sort: "-date",
				expand: "exercise.body_part",
				filter: `user = "${userId}"`,
			});
			return { success: true, data: records as Log[] };
		} catch (error) {
			console.error("Error fetching logs", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Kon logs niet ophalen",
				data: [] as Log[],
			};
		}
	};

	const addLog = async (log: any) => {
		try {
			/* console.log(log); */
			await pb.collection("logs").create(log);
			return { success: true };
		} catch (error) {
			console.error("Error adding log", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Kon log niet toevoegen",
			};
		}
	};

	const deleteLog = async (logId: string) => {
		try {
			await pb.collection("logs").delete(logId);
			return { success: true };
		} catch (error) {
			console.error("Error deleting log", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Kon log niet verwijderen",
			};
		}
	};

	/* EXERCISES */
	const getExercises = async () => {
		try {
			const records = await pb.collection("exercises").getFullList({
				sort: "body_part.name",
				expand: "body_part",
			});

			const transformed = Object.values(
				records.reduce((acc: Record<string, { label: string; items: { label: string; value: string }[] }>, obj) => {
					const bodyPartName = obj.expand?.body_part.name;
					if (!acc[bodyPartName]) {
						acc[bodyPartName] = {
							label: bodyPartName,
							items: [],
						};
					}
					acc[bodyPartName].items.push({ label: obj.name, value: obj.id });
					return acc;
				}, {})
			);

			return { success: true, data: transformed };
		} catch (error) {
			console.error("Error fetching exercises", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Kon oefeningen niet ophalen",
				data: [],
			};
		}
	};

	return {
		pb,
		user,
		login,
		register,
		logout,
		getLogs,
		addLog,
		deleteLog,
		getExercises,
	};
};
