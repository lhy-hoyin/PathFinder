import Header from "../components/Header";
import UserBasicInfo from "../components/UserBasicInfo";
import UserAcadInfo from "../components/UserAcadInfo";
import ChangePassword from "../components/ChangePassword";


export default function UserProfile() {

    return (
        <>
            <Header />
            <h1>Profile</h1>

            <h3>Personal Information</h3>
            <UserBasicInfo />

            <h3>Academic Information</h3>
            <UserAcadInfo />

            <h3>Change password</h3>
            <ChangePassword />
        </>    
    );

}