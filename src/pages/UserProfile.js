import UserBasicInfo from "../components/UserBasicInfo";
import Header from "../components/Header";

export default function UserProfile() {

    return (
        <>
            <Header />
            <h1>Profile</h1>

            <h3>Personal Information</h3>
            <UserBasicInfo />
        </>    
    );

}