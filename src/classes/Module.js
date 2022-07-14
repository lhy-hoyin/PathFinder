import React from "react";

export class Module {
    constructor(id, info, colour, x, y, label) {
        this.id = id; //aka the code
        this.isCompleted = false;

        // relations
        this.preq = [];
        this.orPreq = [];
        this.dependentMods = [];

        // For the graph
        this.label = id;
        this.info = info;
        this.color = colour;
        this.x = x;
        this.y = y;

        // For semesster
        this.semColor = "#456C86";
    }

    setPreReq = (allPreReq, allMods) => {
        const totalCount = allPreReq.length;

        //helper function
        const nodeExist = (checkMod, arr) => {
            let modExist = [];
            let count = 0;
            for (var x = 0; x < checkMod.length; x++) {
                if (arr.includes(checkMod[x])) {
                    modExist[count] = checkMod[x];
                    count++;
                }
            }
            return modExist;
        };

        if (totalCount === 0) {
            return;
        }

        for (var count = 0; count < totalCount; count++) {
            let modWithOr = allPreReq[count].toString().split(",");
            modWithOr = nodeExist(modWithOr, allMods);

            if (modWithOr.length > 1) {
                this.orPreq.push(modWithOr);
            } else if (modWithOr.toString() !== "") {
                this.preq.push(modWithOr.toString());
            }
        }
    };

    addDependentMods = (mod) => {
        this.dependentMods.push(mod);
    };

    changingLabel = (newLabel) => (this.label = newLabel);

}
