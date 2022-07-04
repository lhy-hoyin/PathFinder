import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Link, Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from '@chakra-ui/react';

import { supabase } from "../supabaseClient";
import { ProfileRoles } from "../constants";
import { Auth } from "../hooks/Auth";
import LoginPop from './LoginPop';

import "../css/Header.css";

export default function Header() {

    const navigate = useNavigate();
    const user = supabase.auth.user();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { profileInfoReady, role, email, firstName, lastName, logout } = Auth();

    useEffect(() => {
        if (!profileInfoReady)
            return

        if (role == ProfileRoles.New)
            return navigate("/profile/new");

    }, [profileInfoReady]);

    return (
        <div className="header">

            <Link href="/">
                <Image src="img/banner.png" alt="Pathfinder" height="100"/>
            </Link>

            <div className="nav-links">
                {!user ? (
                    <ul>
                        <li className='clickable'><a href="/sign-up">Sign Up</a></li>
                        <li className='clickable'><a onClick={onOpen}>Login</a></li>
                        <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Login</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <LoginPop />
                                </ModalBody>
                            </ModalContent>
                        </Modal>
                    </ul>
                ) : (
                    <ul>
                        <li>Welcome, {firstName ?? lastName ?? email ?? "user"}!</li>
                        <li className='clickable'><a href="/profile">Profile</a></li>
                        <li className='clickable'><a onClick={logout}  style={{cursor:'pointer'}}>Logout</a></li>
                    </ul>
                )}
            </div>

        </div>
    );
}