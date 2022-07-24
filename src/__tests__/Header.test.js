import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';

import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from "react-router-dom";
import { ProvideAuth } from "../hooks/Auth";
import { supabase } from "../helpers/SupabaseClient";
import Header from "../components/Header";

beforeEach(() => {
    render(
        <ChakraProvider>
            <ProvideAuth>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </ProvideAuth>
        </ChakraProvider>
    );
});

afterEach(cleanup);

const login = async () => {
    const { error } = await supabase.auth.signIn({
        email: "vrv84363@xcoxc.com",
        password: "password",
    });

    const session = supabase.auth.session()
}

const logout = async () => {
    supabase.auth.signOut();
}

it("renders without crashing", () => {
    expect(renderer.create(
        <ChakraProvider>
            <ProvideAuth>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </ProvideAuth>
        </ChakraProvider>
    ).toJSON()).toMatchSnapshot();
});

test("elements in guest mode", () => {
    expect(screen.getByText("Sign Up")).toBeDefined()
    expect(screen.getByText("Login")).toBeDefined()

    expect(screen.queryByText("Profile")).toBeNull()
    expect(screen.queryByText("Logout")).toBeNull()
})

test("elements in user mode", async () => {
    await login()

    await waitFor(() => {
        const menu = screen.getByTestId("hamburger-btn")
        expect(menu).toBeDefined()
        fireEvent(menu,
            new MouseEvent('click', { bubbles: true, cancelable: true, })
        )    
    })

    expect(screen.getByText("Profile")).toBeDefined()
    expect(screen.getByText("Logout")).toBeDefined()

    expect(screen.queryByText("Sign Up")).toBeNull()
    expect(screen.queryByText("Login")).toBeNull()

    await logout()
})
