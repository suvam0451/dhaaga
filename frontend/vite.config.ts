import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default ({ mode }: any) => {
	// extra process.env parameters, if you absolutely must
	process.env.EXTRA_ENV = "extra env";

	return defineConfig({
		plugins: [react()],
		define: {
			"process.env": process.env,
			/** 
			 * should not need to pass anything else.
			 * Functions cannot even be passed
			 * 
			 * Solution --> remove dependency on dotenv
			 * */
			// "process.argv": process.argv,
			// "process.cwd": process.cwd, 
		},
	});
};
