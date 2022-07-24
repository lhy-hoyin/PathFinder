import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';

import { ChakraProvider } from '@chakra-ui/react';
import { ProvideAuth } from "../hooks/Auth";
import LoginPop from "../components/LoginPop";

beforeEach(() => {
    render(
        <ChakraProvider>
            <ProvideAuth>
                <LoginPop />
            </ProvideAuth>
        </ChakraProvider>
    );
});

afterEach(cleanup);

it("renders without crashing", () => {
    expect(renderer.create(
        <ChakraProvider>
            <ProvideAuth>
                <LoginPop />
            </ProvideAuth>
        </ChakraProvider>
    ).toJSON()).toMatchSnapshot();
});

it("text display correctly", () => {
    expect(screen.getByText("Login Details")).toBeDefined()
    expect(screen.getByPlaceholderText("Email")).toBeDefined()
    expect(screen.getByPlaceholderText("Enter Password")).toBeDefined()
    expect(screen.getByText("Show")).toBeDefined()
    expect(screen.getByText("Log In")).toBeDefined()
    expect(screen.getByText("Forget Password?")).toBeDefined()
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

it("has forget password link", () => {
    expect(screen.getByRole("link", { name: "Forget Password?" })).toBeDefined()
})