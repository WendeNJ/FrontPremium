export function createPageUrl(pageName) {
  const routes = { 'Home': '/', 'Admin': '/admin' }
  return routes[pageName] || '/'
}

export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}