export default function crossOriginIsolationPlugin(context, options) {
    return {
        name: 'cross-origin-isolation-plugin',
        configureWebpack(config, isServer) {
            return {
                devServer: {
                    headers: {
                        'Cross-Origin-Embedder-Policy': 'require-corp',
                        'Cross-Origin-Opener-Policy': 'same-origin',
                    },
                },
            };
        },
    };
}