export const isAdmin = () => {
  if (window.location.href.includes('admin')) {
    return true
  }else{
    return false
  }
}