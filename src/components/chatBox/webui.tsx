import {
    SandpackProvider,
    SandpackLayout,
    SandpackPreview,
    SandpackThemeProp,
} from "@codesandbox/sandpack-react";
import { useEffect, useState } from "react";
import { webUiState } from '@site/src/recoil/chatBox';
import { useRecoilState } from "recoil";

const WebUi = () => {
    const [webUi] = useRecoilState(webUiState);

    if (!webUi?.files) {
        window.history.back()
        return null
    }
    const dependencies = Object.fromEntries(
        webUi.packages.map((dep) => [dep.slice(0, dep.lastIndexOf("@")), "latest"])
    );

    const codeFiles = Object.fromEntries(
        Object.entries(webUi.files).map(([file, code]) => [file, { code }])
    );

    const generateRoutes = () =>
        webUi.routes.map(({ path, name, component }) => ({
            path,
            name,
            component: `() => import('../views/${component}.vue')`,
        }));

    const [routers, setRouters] = useState("");

    useEffect(() => {
        const routes = generateRoutes();
        const routerString = [
            `{ path: '/', redirect: '${routes[0]?.path}' }`,
            ...routes.map(
                ({ path, name, component }) =>
                    `{ path: '${path}', name: '${name}', component: ${component} }`
            ),
        ].join(",");
        setRouters(routerString);
    }, []);

    function getTheme(): SandpackThemeProp {
        const theme = localStorage.getItem("theme");
        if (theme === "light" || theme === "dark" || theme === "auto") {
            return theme;
        }
        return "auto";
    }

    return (
        <div className="relative w-screen h-screen">
            <div className="absolute top-4 left-4 flex gap-4 z-50">
                <div onClick={() => window.history.back()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                </div>
            </div>
            <SandpackProvider
                customSetup={{ dependencies }}
                files={{
                    ...codeFiles,
                    "/src/routes/index.js": {
                        code: `import { createRouter, createWebHistory } from 'vue-router';const routes = [  ${routers}];const router = createRouter({  history: createWebHistory(process.env.BASE_URL),  routes});export default router;`,
                    },
                    "/src/App.vue": {
                        code: `<template><router-view></router-view></template>`,
                    },
                    "/src/main.js": {
                        code: `import { createApp } from "vue";import App from "./App.vue";import router from "./routes/index.js";import { createPinia } from "pinia";import ElementPlus from "element-plus";import "element-plus/dist/index.css";const app = createApp(App);app.use(router);app.use(ElementPlus);app.use(createPinia());app.mount("#app");`,
                    },
                }}
                theme={getTheme()}
                template="vue"
                style={{ height: "100%", width: "100%" }}
            >
                <SandpackLayout style={{ height: "100%", width: "100%" }}>
                    <SandpackPreview style={{ height: "100%", width: "100%" }} />
                </SandpackLayout>
            </SandpackProvider>
        </div>
    );
};

export default WebUi;
