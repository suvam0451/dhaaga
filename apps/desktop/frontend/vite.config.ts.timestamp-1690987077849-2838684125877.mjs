// vite.config.ts
import { defineConfig } from "file:///Users/suvam/Documents/Repos/dhaaga/node_modules/.pnpm/vite@4.4.5_@types+node@20.4.5/node_modules/vite/dist/node/index.js";
import react from "file:///Users/suvam/Documents/Repos/dhaaga/node_modules/.pnpm/@vitejs+plugin-react-swc@3.3.2_vite@4.4.5/node_modules/@vitejs/plugin-react-swc/index.mjs";
var vite_config_default = ({ mode }) => {
  process.env.EXTRA_ENV = "extra env";
  return defineConfig({
    plugins: [react()],
    define: {
      "process.env": process.env
      /** 
       * should not need to pass anything else.
       * Functions cannot even be passed
       * 
       * Solution --> remove dependency on dotenv
       * */
      // "process.argv": process.argv,
      // "process.cwd": process.cwd, 
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3V2YW0vRG9jdW1lbnRzL1JlcG9zL2RoYWFnYS9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N1dmFtL0RvY3VtZW50cy9SZXBvcy9kaGFhZ2EvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N1dmFtL0RvY3VtZW50cy9SZXBvcy9kaGFhZ2EvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0ICh7IG1vZGUgfTogYW55KSA9PiB7XG5cdC8vIGV4dHJhIHByb2Nlc3MuZW52IHBhcmFtZXRlcnMsIGlmIHlvdSBhYnNvbHV0ZWx5IG11c3Rcblx0cHJvY2Vzcy5lbnYuRVhUUkFfRU5WID0gXCJleHRyYSBlbnZcIjtcblxuXHRyZXR1cm4gZGVmaW5lQ29uZmlnKHtcblx0XHRwbHVnaW5zOiBbcmVhY3QoKV0sXG5cdFx0ZGVmaW5lOiB7XG5cdFx0XHRcInByb2Nlc3MuZW52XCI6IHByb2Nlc3MuZW52LFxuXHRcdFx0LyoqIFxuXHRcdFx0ICogc2hvdWxkIG5vdCBuZWVkIHRvIHBhc3MgYW55dGhpbmcgZWxzZS5cblx0XHRcdCAqIEZ1bmN0aW9ucyBjYW5ub3QgZXZlbiBiZSBwYXNzZWRcblx0XHRcdCAqIFxuXHRcdFx0ICogU29sdXRpb24gLS0+IHJlbW92ZSBkZXBlbmRlbmN5IG9uIGRvdGVudlxuXHRcdFx0ICogKi9cblx0XHRcdC8vIFwicHJvY2Vzcy5hcmd2XCI6IHByb2Nlc3MuYXJndixcblx0XHRcdC8vIFwicHJvY2Vzcy5jd2RcIjogcHJvY2Vzcy5jd2QsIFxuXHRcdH0sXG5cdH0pO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1QsU0FBUyxvQkFBNkI7QUFDNVYsT0FBTyxXQUFXO0FBR2xCLElBQU8sc0JBQVEsQ0FBQyxFQUFFLEtBQUssTUFBVztBQUVqQyxVQUFRLElBQUksWUFBWTtBQUV4QixTQUFPLGFBQWE7QUFBQSxJQUNuQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsSUFDakIsUUFBUTtBQUFBLE1BQ1AsZUFBZSxRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBU3hCO0FBQUEsRUFDRCxDQUFDO0FBQ0Y7IiwKICAibmFtZXMiOiBbXQp9Cg==
