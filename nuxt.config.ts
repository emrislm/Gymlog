import Material from "@primevue/themes/material";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	modules: ["@primevue/nuxt-module"],
	primevue: {
		options: {
			theme: {
				preset: Material,
				darkMode: true,
			},
		},
	},
	css: ["~/assets/css/main.css"],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
});

