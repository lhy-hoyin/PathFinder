import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';

import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from "react-router-dom";
import { ProvideAuth } from "../hooks/Auth";
import SignUp from "../pages/SignUp";

beforeEach(() => {
    render(
        <ChakraProvider>
            <ProvideAuth>
                <BrowserRouter>
                    <SignUp />
                </BrowserRouter>
            </ProvideAuth>
        </ChakraProvider>
    );
});

afterEach(cleanup);

it("renders without crashing", () => {
    expect(renderer.create(
        <ChakraProvider>
            <ProvideAuth>
                <BrowserRouter>
                    <SignUp />
                </BrowserRouter>
            </ProvideAuth>
        </ChakraProvider>
    ).toJSON()).toMatchSnapshot();
});

it("text display correctly", () => {
    expect(screen.getByRole("heading", { name:"Sign Up"})).toBeDefined()

    expect(screen.getByPlaceholderText("Email")).toBeDefined()

    expect(screen.getByPlaceholderText("Enter Password")).toBeDefined()
    expect(screen.getByText("Show")).toBeDefined()

    expect(screen.getByPlaceholderText("Re-enter Password")).toBeDefined()

    expect(screen.getByText("Register As New User")).toBeDefined()
})

test("toggle show password function", async () => {
    const passwordInput = screen.getByPlaceholderText("Enter Password")
    const passwordToggle = screen.getByText("Show")

    expect(passwordInput.type).toBe("password")

    await waitFor(() => {
        fireEvent(passwordToggle,
            new MouseEvent('click', { bubbles: true, cancelable: true, })
        )
        expect(passwordInput.type).toBe("text")
    })

    await waitFor(() => {
        fireEvent(passwordToggle,
            new MouseEvent('click', { bubbles: true, cancelable: true, })
        )
        expect(passwordInput.type).toBe("password")
    })
})