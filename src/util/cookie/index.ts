export function getCookie(name: string) {
    let cookieArray = document.cookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookiePair = cookieArray[i].split('=');
        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}


export function deleteCookie(name: string) {
    const domain = window.location.hostname;
    document.cookie = name + '=; Path=/; Domain=' + domain + '; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function setLocalStorageItem(key: string, value: string) {
    localStorage.setItem(key, value);
    const event = new Event('localStorageChange');
    window.dispatchEvent(event);
}