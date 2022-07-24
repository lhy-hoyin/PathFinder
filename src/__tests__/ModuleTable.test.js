import { render, cleanup, screen, waitFor, fireEvent } from '@testing-library/react';
import { ProvideGraphData } from "../hooks/GraphData";
import ModulesTable from "../components/ModulesTable";

afterEach(cleanup)

const setup = () => {
    const comp = render(<ProvideGraphData><ModulesTable /></ProvideGraphData>)

    const addModInput = screen.getByTestId("modCode-input")
    const addBtn = screen.getByTestId("add-btn")

    return { addModInput, addBtn, ...comp }
}

it("valid module code", async () => {
    const { addModInput, addBtn } = setup()

    await waitFor(() => {
        fireEvent.change(addModInput, { target: { value: 'CS2040S' } })
        expect(addBtn.disabled).toBeFalsy()

        fireEvent.change(addModInput, { target: { value: 'cs2040S' } })
        expect(addBtn.disabled).toBeFalsy()

        fireEvent.change(addModInput, { target: { value: 'Cs2040' } })
        expect(addBtn.disabled).toBeFalsy()
    })
})

it("invalid module code", async () => {
    const { addModInput, addBtn } = setup()

    await waitFor(() => {
        fireEvent.change(addModInput, { target: { value: 'CS2020' } })
        expect(addBtn.disabled).toBeTruthy()
    })
})