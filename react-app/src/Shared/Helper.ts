/*
 * @Author: Kanata You 
 * @Date: 2020-11-02 21:34:24 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-11-02 21:37:02
 */

export const encodeIPC = (str: string): string => {
    return str.split("/").join("$s").split(".").join("$d");
};
