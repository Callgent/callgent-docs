import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const withSSRExclusion = (Component) => {
    const WrappedComponent = (props) => {
        if (!ExecutionEnvironment.canUseDOM) {
            return null;
        }
        return <Component {...props} />;
    };
    WrappedComponent.displayName = `withSSRExclusion(${Component.displayName || Component.name || 'Component'})`;
    return WrappedComponent;
};

const wrapCustomComponents = (components) => {
    const wrappedComponents = {};
    for (const [key, Component] of Object.entries(components)) {
        if (typeof Component === 'function' && !key.match(/^[a-z]+$/)) {
            wrappedComponents[key] = withSSRExclusion(Component);
        } else {
            wrappedComponents[key] = Component;
        }
    }
    return wrappedComponents;
};

export default wrapCustomComponents({
    ...MDXComponents
});