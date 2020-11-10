/*
 * @Author: Kanata You 
 * @Date: 2020-11-10 14:31:46 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-11-10 18:02:22
 */

import { ModeJavaScript } from "../LanguageSupport/ModeJavaScript";
import "./CodeHightlight.css";


export type Highlighter = (text: string) => string;

export type HighlighterItem = {
    name: string;
    reg: Array<string>;
    highlighter: Highlighter;
};


export const getTokens = (text: string) => {
    const chars = text.split("");
    let lastChar = "";
    let temp = "";
    let box: Array<string> = [];
    for (let i = 0; i < chars.length; i++) {
        if (lastChar === "") {
            temp += chars[i];
        } else if (chars[i] === " ") {
            if (lastChar === " ") {
                temp += chars[i];
            } else {
                box.push(temp);
                temp = " ";
            }
        } else if (lastChar === " ") {
            box.push(temp);
            temp = chars[i];
        } else if (chars[i] === "\n") {
            box.push(temp, "\n");
            temp = "";
        } else if (/[a-zA-Z$]/.test(chars[i])) {
            if (/[a-zA-Z$_&]/.test(lastChar)) {
                temp += chars[i];
            } else {
                box.push(temp);
                temp = chars[i];
            }
        } else if (/[0-9]/.test(chars[i])) {
            if (/[0-9.e-]/.test(lastChar)) {
                temp += chars[i];
            } else {
                box.push(temp);
                temp = chars[i];
            }
        } else {
            if (/[a-zA-Z$_&]/.test(lastChar)) {
                box.push(temp);
                temp = chars[i];
            } else {
                temp += chars[i];
            }
        }
        lastChar = chars[i];
    }
    if (temp.length) {
        box.push(temp);
    }

    return box.filter(d => d.length);
};


class CodeHighlighter {

    protected highlighter: Array<HighlighterItem> = [
        ModeJavaScript
    ];

    public getMode(filename: string): string {
        if (filename.includes(".")) {
            const mode = filename.split(".").reverse()[0];
            for (let i: number = 0; i < this.highlighter.length; i++) {
                if (this.highlighter[i].reg.includes(mode)) {
                    return this.highlighter[i].name;
                }
            }
        }
        return "Plain Text";
    }

    public parse(filename: string, text: string): string {
        if (filename.includes(".")) {
            const mode = filename.split(".").reverse()[0];
            for (let i: number = 0; i < this.highlighter.length; i++) {
                if (this.highlighter[i].reg.includes(mode)) {
                    return this.highlighter[i].highlighter(text);
                }
            }
        }
        return text;
    }

    public getSupportedModes(): Array<string> {
        return this.highlighter.map(d => d.name);
    }

};

export const codeHighlighter: CodeHighlighter = new CodeHighlighter();
