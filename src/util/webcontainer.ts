import { WebContainer } from '@webcontainer/api';

export const initPackages = ['nprogress', 'vite-plugin-progress', 'vue-router', 'pinia', 'axios', 'element-plus']

// writeFile
export async function writeFile(webcontainer: WebContainer, filePath: string, content: string, base: string = '') {
    filePath = base + filePath
    const pathParts = filePath.split('/');
    pathParts.pop();
    const folderPath = pathParts.join('/');

    const dirExists = await doesPathExist(webcontainer, folderPath);
    if (!dirExists) {
        await webcontainer.fs.mkdir(folderPath, { recursive: true });
    }
    await webcontainer.fs.writeFile(filePath, content);
    return 'ok'
}

async function doesPathExist(webcontainer: WebContainer, path: string): Promise<boolean> {
    try {
        await webcontainer.fs.readdir(path);
        return true;
    } catch (err) {
        return false;
    }
}

export const runShellCommand = async (
    webcontainer: WebContainer, commands: string, config: Object = {}
) => {
    console.log(commands);
    const [command, ...args] = commands.split(' ');
    const startProcess = await webcontainer.spawn(command, args, config);

    return startProcess.exit;
}

export async function asyncForEach(array, callback) {
    for (let i = 0; i < array.length; i++) {
        await callback(array[i], i, array);
    }
}

export const vueFiles = (
    router: { path: string; name: string; component: string }[],
    files: object
) => {
    const routes = router.map(({ path, name, component }) => (
        { path, name, component: `() => import('../views/${component}.vue')` }
    ));
    const routerFile = [
        `{ path: '/', redirect: '${routes[0]?.path}' }`,
        ...routes.map(({ path, name, component }) =>
            `{ path: '${path}', name: '${name}', component: ${component} }`
        ),
    ].join(",");
    const fileList = [
        { path: '/index.html', code: `<!DOCTYPE html><html lang="en">  <head>    <meta charset="UTF-8" />    <link rel="icon" type="image/svg+xml" href="/vite.svg" />    <meta name="viewport" content="width=device-width, initial-scale=1.0" />    <title>Vite + Vue</title>    <style>      #loading {        position: fixed;        top: 0;        left: 0;        width: 100%;        height: 100%;        background: white;        display: flex;        align-items: center;        justify-content: center;        z-index: 9999;      }      .spinner {        width: 50px;        height: 50px;        border: 5px solid #ccc;        border-top-color: #007bff;        border-radius: 50%;        animation: spin 1s linear infinite;      }      @keyframes spin {        to {          transform: rotate(360deg);        }      }    </style>  </head>  <body>    <div id="app"></div>    <script type="module" src="/src/main.js"></script>    <div id="loading">      <div class="spinner"></div>    </div>  </body></html>` },
        { path: '/vite.config.js', code: `import { join } from "path"; import { defineConfig } from 'vite'; import vue from '@vitejs/plugin-vue'; import progress from 'vite-plugin-progress'; export default defineConfig({ plugins: [vue(), progress({ format: 'minimal', }),], resolve: { alias: { '@': join(__dirname, "src"), }, }, build: { outDir: join(__dirname, '../public'), emptyOutDir: true, } });` },
        { path: '/package.json', code: `{  "name": "vite",  "private": true,  "version": "0.0.0",  "type": "module",  "scripts": {    "dev": "vite",    "build": "vite build",    "preview": "vite preview"  },  "dependencies": {    "axios": "^1.7.9",    "element-plus": "^2.9.0",    "pinia": "^2.3.0",    "vue": "^3.5.10",    "vue-router": "^4.5.0"  },  "devDependencies": {    "@vitejs/plugin-vue": "^5.1.4",    "vite": "^5.4.8"  }}` },
        { path: '/src/main.js', code: `import NProgress from 'nprogress'; import 'nprogress/nprogress.css'; import { createApp } from "vue"; import App from "./App.vue"; import router from "./routes/index.js"; import { createPinia } from "pinia"; import ElementPlus from "element-plus"; import "element-plus/dist/index.css"; const app = createApp(App); app.use(router); app.use(ElementPlus); app.use(createPinia()); app.mount("#app"); window.addEventListener('load', () => { NProgress.done(); const loader = document.getElementById('loading'); if (loader) { loader.style.opacity = '0'; loader.style.display = 'none'; } });` },
        { path: '/src/App.vue', code: `<template><router-view></router-view></template><style>*{margin: 0;padding: 0;}</style>` },
        { path: '/src/routes/index.js', code: `import { createRouter, createWebHistory } from 'vue-router'; const routes = [ ${routerFile} ]; const router = createRouter({ history: createWebHistory(), routes }); export default router;` },
    ]
    for (const [file, code] of Object.entries(files)) {
        fileList.push({ path: file, code });
    }
    return fileList;
};

export async function startDev(webcontainer, webUi) {
    const packages = webUi.packages.map(item => {
        return item.slice(0, item.lastIndexOf("@"))
    })
    await runShellCommand(webcontainer, `pnpm i ` + packages.join(' '), { cwd: '/vite' })

    const files = vueFiles(webUi?.routes, webUi?.files)

    await asyncForEach(files, async (item) => {
        await new Promise<void>(async (resolve, reject) => {
            try {
                await writeFile(webcontainer, item.path, item.code, '/vite');
                resolve();
            } catch (error) { reject(error) }
        });
    });
}
