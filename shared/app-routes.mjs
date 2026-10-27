// Derived from navGroups/titles and Interface's existing hash-route dispatch.
// The operational home is the current '/' hash route, not a new dashboard path.
export const APP_HOME_URL = '/#/';
export const LOGIN_URL = '/login';
export const isLoginPath = pathname => pathname === LOGIN_URL || pathname === LOGIN_URL + '/';
export const isApplicationHash = hash => hash.startsWith('#/');
