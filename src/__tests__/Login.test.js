import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { ProvideAuth } from "../hooks/Auth";
import LoginPop from "../components/LoginPop";

afterEach(cleanup);


it('renders without crashing', () => {
    const tree = renderer.create(
        <ProvideAuth>
            <LoginPop />
        </ProvideAuth>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});


it("login by normal user", () => {
    const loginMock = jest.fn();

    render(<ProvideAuth><LoginPop /></ProvideAuth>)

    const email = screen.getByTestId("email_input")
    const password= screen.getByTestId("password-input")
    const submit = screen.getByTestId("login-btn")

    fireEvent.change(email, { target: { value: 'vrv84363@xcoxc.com'} })
    fireEvent.change(password, { target: { value: 'password' } })
    fireEvent.click(submit)

    expect(loginMock).toBeCalled()
})