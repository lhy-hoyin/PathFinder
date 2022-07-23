import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
    Menu, MenuButton, MenuList, MenuItem,
    Link, Image, IconButton,
    useDisclosure
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons'

import { ProfileRoles } from "../constants";
import { supabase } from "../helpers/SupabaseClient";
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

    const goProfilePage = () => {
        navigate("/profile")
    }

    return (
        <div className="header">

            <Link href="/">
                <Image src="img/banner.png" alt="Pathfinder" height="100" />
            </Link>

            <div className="nav-links">
                {!user ?
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
                    :
                    <ul>
                        <li>Welcome, {firstName ?? lastName ?? email ?? "user"}!</li>
                        <li>
                            <Menu isLazy computePositionOnMount>
                                <MenuButton as={IconButton} icon={<HamburgerIcon />} variant='outline' />
                                <MenuList>
                                    <MenuItem onClick={goProfilePage}>Profile</MenuItem>
                                    <MenuItem onClick={logout}>Logout</MenuItem>
                                </MenuList>
                            </Menu>
                        </li>
                    </ul>
                }
            </div>

        </div>
    );
}