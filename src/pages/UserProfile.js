import { Heading } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

import Header from "../components/Header";
import UserBasicInfo from "../components/UserBasicInfo";
import UserAcadInfo from "../components/UserAcadInfo";
import ChangePassword from "../components/ChangePassword";

export default function UserProfile() {

    return (
        <>
            <Header />

            <Heading as='h1'>Profile</Heading>

            <Tabs isManual isLazy variant='enclosed'>
                <TabList>
                    <Tab>Personal</Tab>
                    <Tab>Academic</Tab>
                    <Tab>Security</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Heading as='h3' size='md'>Personal Information</Heading>
                        <UserBasicInfo />
                    </TabPanel>

                    <TabPanel>
                        <Heading as='h3' size='md'>Academic Information</Heading>
                        <UserAcadInfo />
                    </TabPanel>

                    <TabPanel>
                        <Heading as='h3' size='md'>Change password</Heading>
                        <ChangePassword />
                    </TabPanel>
                </TabPanels>
            </Tabs>

        </>
    );

}