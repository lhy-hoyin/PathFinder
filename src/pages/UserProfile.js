import { Heading } from '@chakra-ui/react';

import Header from "../components/Header";
import UserBasicInfo from "../components/UserBasicInfo";
import UserAcadInfo from "../components/UserAcadInfo";
import ChangePassword from "../components/ChangePassword";

export default function UserProfile() {

    return (
        <>
            <Header />

            <Heading as='h1'>Profile</Heading>

            <Heading as='h3' size='md'>Personal Information</Heading>
            <UserBasicInfo />

            <Heading as='h3' size='md'>Academic Information</Heading>
            <UserAcadInfo />

            <Heading as='h3' size='md'>Change password</Heading>
            <ChangePassword />
        </>    
    );

}