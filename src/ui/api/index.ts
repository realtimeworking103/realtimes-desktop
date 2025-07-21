export function callLdInstance(name:string) {
  return window.electron.callLdInstance(name);
}

export function deleteLdInstance(name:string) {
  return window.electron.deleteLdInstance(name);
}

export function deleteRowFromDB(name: string) {
  return window.electron.deleteRowFromDB(name);
}