/*
 * @Author: Kanata You 
 * @Date: 2020-10-21 22:31:38 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-10-28 20:45:45
 */

import $ from "jquery";


export type KeyName = (
    'esc' | '`' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0' | '-' | '+' |
    'backspace' | 'tab' | 'Q' | 'W' | 'E' | 'R' | 'T' | 'Y' | 'U' | 'I' | 'O' | 'P' | '[' |
    ']' | '\\' | 'A' | 'S' | 'D' | 'F' | 'G' | 'H' | 'J' | 'K' | 'L' | ';' | '\'' | 'enter' |
    'shift' | 'Z' | 'X' | 'C' | 'V' | 'B' | 'N' | 'M' | ',' | '.' | '/' | 'ctrl' | 'alt' |
    'space' | 'left' | 'up' | 'down' | 'right'
);

const keyMap: {[code: number]: KeyName;} = {
    8: "backspace",
    9: "tab",
    13: "enter",
    16: "shift",
    17: "ctrl",
    18: "alt",
    27: "esc",
    32: "space",
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    65: "A",
    66: "B",
    67: "C",
    68: "D",
    69: "E",
    70: "F",
    71: "G",
    72: "H",
    73: "I",
    74: "J",
    75: "K",
    76: "L",
    77: "M",
    78: "N",
    79: "O",
    80: "P",
    81: "Q",
    82: "R",
    83: "S",
    84: "T",
    85: "U",
    86: "V",
    87: "W",
    88: "X",
    89: "Y",
    90: "Z",
    186: ";",
    187: "+",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'"
};

let keyStack: Array<[KeyName, boolean]> = [];

export const getActiveKeys = () => keyStack.map(key => key[0]).join("+");


let hotKeyListeners: {
    [selector: string]: {[keyset: string]: [() => void, number] | undefined}
} = {};


export const addHotKey = (
    target: string, keys: Array<KeyName>, callback: () => void, priority: number = 1
) => {
    const keyset: string = keys.join("+");
    if (hotKeyListeners[target][keyset] === void 0 || hotKeyListeners[target][keyset]![1] < priority) {
        hotKeyListeners[target][keyset] = [callback, priority];
        return true;
    }
    
    return false;
};

export const removeHotKey = (target: string, keys: Array<KeyName>) => {
    const keyset: string = keys.join("+");
    hotKeyListeners[target][keyset] = void 0;
};


export const initHotKeyListeners = (target: string, blockAllDefaultBehaviours: boolean = true) => {
    $(target)[0].tabIndex = 1;
    
    $(target)[0].addEventListener("keydown", (e: KeyboardEvent) => {
        const key: KeyName | undefined = keyMap[e.which];
        if (key === "tab" || (blockAllDefaultBehaviours && key)) {
            e.preventDefault();
        }
        if (!keyStack.length || keyStack[keyStack.length - 1][0] !== key) {
            keyStack.push([key, true]);
        }
    });
    
    $(target)[0].addEventListener("keyup", (e: KeyboardEvent) => {
        const key: KeyName | undefined = keyMap[e.which];
        if (blockAllDefaultBehaviours) {
            e.preventDefault();
        }
        if (key) {
            const listener = hotKeyListeners[target][getActiveKeys()];
            if (listener) {
                listener[0]();
            }
            for (let i: number = keyStack.length - 1; i >= 0; i--) {
                if (keyStack[i][0] === key && keyStack[i][1]) {
                    if (i === keyStack.length - 1) {
                        let keyStackSwp: [KeyName, boolean][] = [];
                        let flagSkip: boolean = true;
                        for (let j = i - 1; j >= 0; j--) {
                            if (!flagSkip || keyStack[j][1]) {
                                keyStackSwp.push(keyStack[j]);
                                flagSkip = false;
                            }
                        }
                        keyStack = keyStackSwp.reverse();
                    } else {
                        keyStack[i][1] = false;
                    }
                    break;
                }
            }
        }
    });

    hotKeyListeners[target] = {};
};

initHotKeyListeners("body");


window.onblur = () => {
    keyStack = [];
};

window.onfocus = () => {
    keyStack = [];
};
