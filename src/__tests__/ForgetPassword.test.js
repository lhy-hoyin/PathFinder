import { render, cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer';

import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from "react-router-dom";
import { ProvideAuth } from "../hooks/Auth";
import SendingResetLink from "../pages/ForgetPassword";

beforeEach(() => {
    render(
        <ChakraProvider>
            <ProvideAuth>
                <BrowserRouter>
                    <SendingResetLink />
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
                    <SendingResetLink />
                </BrowserRouter>
            </ProvideAuth>
        </ChakraProvider>
    ).toJSON()).toMatchSnapshot();
});