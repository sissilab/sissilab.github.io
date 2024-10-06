const lang = document.getElementById('xr-lang')?.value;
const contextPath = document.getElementById('xr-context-path')?.value;
const urlPath = window.location.pathname || '/';

if (lang) {
  const normalizedContextPath = normalizePath(contextPath);
  const normalizedUrlPath = normalizePath(urlPath);
  if (normalizedUrlPath === normalizedContextPath)
    window.location.href = '/' === contextPath ? '/' + lang : contextPath + '/' + lang;
}

function normalizePath(path) {
  if (!path)
    return '/';
  if (path.endsWith('/')) {
    return path;
  }
  const lastSlashIdx = path.lastIndexOf('/');
  const pathSuffix = path.substr(lastSlashIdx);
  if ('/index' === pathSuffix || '/index.html' === pathSuffix) {
    return path.substr(0, lastSlashIdx + 1);
  }
  return path + '/';
}
