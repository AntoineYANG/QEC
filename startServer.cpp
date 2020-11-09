/*
 * @Author: Kanata You 
 * @Date: 2020-11-09 11:14:51 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-11-09 11:34:47
 */

#include <stdlib.h>
#include <iostream>

int main(int argc, char* args[]) {
    if (argc == 2 && args[1][0] == 'D') {
        system("start node ./react-app/server.js");
        system("cd react-app && npm start");
    } else {
        system("start node ./react-app/server.js");
        system("start serve -s ./react-app/build");
    }

    return 0;
}
