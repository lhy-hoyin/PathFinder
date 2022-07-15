export class Semester {
    constructor(name, year) {
        this.id = name
        this.name = name
        this.year = year
        this.modules = []
    }

    addModule(mod) {
        this.modules = this.modules.push(mod)
    }

    addModules(modsArr) {
        this.modules = this.modules.concat(modsArr)
    }
}