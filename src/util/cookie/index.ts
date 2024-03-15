
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
const { siteConfig } = useDocusaurusContext();
const baseUrl = siteConfig.customFields;

export function getCookie(name: string) {
    let cookieArray = document.cookie.split(';'); // 分割cookie字符串为数组
    for (let i = 0; i < cookieArray.length; i++) {
        let cookiePair = cookieArray[i].split('='); // 分割每个键值对
        if (name == cookiePair[0].trim()) { // 检查cookie的名称
            return decodeURIComponent(cookiePair[1]); // 返回cookie的值
        }
    }
    return null; // 如果没有找到，返回null
}


export function deleteCookie(name: string) {
    const domain = baseUrl.cookieDomain;
    document.cookie = name + '=; Path=/; Domain=' + domain + '; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
