export class Semester {
    constructor(initializer) {
        this.id = initializer.id || (initializer.year.toString() + initializer.name)
        this.name = initializer.name || initializer.id
        this.year = initializer.year
        this.modules = []
    }

    addModule(mod) {
        this.modules = this.modules.push(mod)
    }

    addModules(modsArr) {
        this.modules = this.modules.concat(modsArr)
    }
}