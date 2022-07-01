import { Heading } from '@chakra-ui/react';

import Header from "../components/Header";
import ChangePassword from "../components/ChangePassword";

export default function ResetPassword() {

    return (
        <>
            <Header />
            <Heading>Reset password</Heading>
            <ChangePassword />
        </>
    );

}