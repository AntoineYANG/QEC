/*
 * @Author: Kanata You 
 * @Date: 2020-10-21 23:51:49 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-10-28 19:05:56
 */

import { BrowserWindow } from "electron";


const win: BrowserWindow = (window as any)['win'];


export const getWindow = () => win;


export const ElectronMinimize = () => {
    win.minimize();
};

let isWindowMaximized: boolean = false;

export const ElectronMaximize = () => {
    if (isWindowMaximized) {
        win.maximize();
    } else {
        win.unmaximize();
    }
    isWindowMaximized = !isWindowMaximized;
};

export const ElectronWindowIsMaximized = () => isWindowMaximized;


export const ElectronClose = () => {
    win.close();
};
