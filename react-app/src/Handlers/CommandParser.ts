/*
 * @Author: Kanata You 
 * @Date: 2020-10-28 19:20:37 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-11-02 01:42:56
 */

export type Command = {
    params: Array<{
        name: string;
        description: string;
        autoComplete?: (input: string) => Array<string>;
    }>;
    args: Array<{
        name: string;
        requireValue: boolean;
        description: string;
        autoComplete?: (input: string) => Array<string>;
    }>;
    description: string;
    execute: (params: Array<string>, args: {[keyname: string]: string;}) => void;
};

export let CommandDict: { [name: string]: Command; } = {
    op: {
        params: [{
            name: "filename",
            description: "the file you want to open",
            autoComplete: (input: string) => {
                return [];
            }
        }],
        args: [{
            name: "-e",
            requireValue: false,
            description: "reject if the file does not exist"
        }, {
            name: "-clear",
            requireValue: false,
            description: "clear the file if it has already exist"
        }],
        description: "Open or create a file to edit.",
        execute: (params: Array<string>, args: {[keyname: string]: string;}) => {}
    },
    opdir: {
        params: [{
            name: "foldername",
            description: "the folder you want to open",
            autoComplete: (input: string) => {
                return [];
            }
        }],
        args: [],
        description: "Open a folder to edit.",
        execute: (params: Array<string>, args: {[keyname: string]: string;}) => {}
    },
    opwsp: {
        params: [{
            name: "filename",
            description: "the workspace you want to open",
            autoComplete: (input: string) => {
                return [];
            }
        }],
        args: [],
        description: "Open a workspace to edit.",
        execute: (params: Array<string>, args: {[keyname: string]: string;}) => {}
    }
};

export const parseParams = <P extends string, A extends string>(cmd: Command, input: string): {
    getParam: (p: P) => string | undefined;
    getArgs: (a: A) => string | undefined | true;
} => {
    let params: {[name: string]: string} = {};
    let args: {[name: string]: string | true} = {};

    let paramIdx: number = 0;
    let argName: string | null = null;
    let argWaitingForValue: boolean = false;
    
    input.split(/ {1,}/).slice(1).forEach(b => {
        const argSet = cmd.args.filter(
            a => a.name === b
        );
        if (argSet.length) {
            argName = b;
            if (argSet[0].requireValue) {
                argWaitingForValue = true;
            } else {
                args[argName] = true;
                argWaitingForValue = false;
            }
        } else {
            if (argName && argWaitingForValue) {
                args[argName] = b;
                argWaitingForValue = false;
            } else if (cmd.params[paramIdx]) {
                params[cmd.params[paramIdx].name] = b;
                paramIdx += 1;
                argName = null;
            }
        }
    });

    console.log(params, args);

    return {
        getParam: (p: P) => params[p],
        getArgs: (a: A) => args[a]
    };
};
