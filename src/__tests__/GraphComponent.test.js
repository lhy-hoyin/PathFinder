import { ModuleColor } from "../constants"
import {
    updateColour,
    updateGraph
} from "../__mocks__/GraphDataMock";

//temporary nodes
var nodes = [
    {
        id: "MA1521", info: ["Calculus for Computing", "2022/2023", 4, "Description of mod"],
        isCompleted: false, label: "MA1521", orPreq: [], preq: [], dependentMods: ['ST2334'],
        color: {background: ""}
    },
    {
        id: "ST2334", info: ["Probability and Statistics", "2022/2023", 4, "Description of mod"],
        isCompleted: false, label: "ST2334", orPreq: [], preq: ['MA1521'], dependentMods: [],
        color: {background: ""}
    }
]

test("Setting up the colours of all the modules (ie.Available, Lock, Completed", () => {
    for (var index = 0; index < nodes.length; index++) {
        nodes = updateColour(nodes, nodes[index].id, [])
    }

    expect(nodes[0].color.background === ModuleColor.Available.rgb
    && nodes[1].color.background === ModuleColor.Locked.rgb).toBeTruthy()
});

test("Double clicking on Green color module will change module to grey", () => {
    nodes = updateGraph(nodes[0].id, nodes)

    expect(nodes[0].color.background === ModuleColor.Completed.rgb).toBeTruthy()
});

test("Double clicking on Grey color module will change module to Green", () => {
    nodes = updateGraph(nodes[0].id, nodes)
    expect(nodes[0].color.background === ModuleColor.Available.rgb).toBeTruthy()
});

test("Double clicking a Red colour module will result to no change", () => {
    const message = updateGraph(nodes[1].id, nodes)
    expect( message === "no change" ).toBeTruthy()
})

test("Double clicking on a Green module, MA1521, will cwhange ST2334 colour to Green", () => {
    nodes = updateGraph(nodes[0].id, nodes)
    expect(nodes[1].color.background === ModuleColor.Available.rgb).toBeTruthy()
})

test("Double clicking on a Grey module, MA1521, will change ST2334 colour to Red", () => {
    nodes = updateGraph(nodes[0].id, nodes)
    expect(nodes[1].color.background === ModuleColor.Locked.rgb).toBeTruthy()
})
