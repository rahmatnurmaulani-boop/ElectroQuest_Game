/** Home owns storage/navigation; the existing picker opens after its DOM has mounted. */
export function openMissionPicker(home:()=>void){home();queueMicrotask(()=>document.querySelector<HTMLButtonElement>('[data-missions]')?.click())}
