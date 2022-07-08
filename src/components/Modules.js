import { useState, useEffect } from 'react';
import {
    Table, Thead, Tbody,
    Th, Tr, Td,
    TableCaption, TableContainer,
    Skeleton, Tooltip,
    IconButton,
    useBoolean, useToast
} from '@chakra-ui/react';
import { RepeatIcon, AddIcon, DeleteIcon } from '@chakra-ui/icons';

import { supabase } from "../supabaseClient";
import {
    getModInfo,
    getUserAcademic, 
    deleteUserAcademicRecord
} from "../hooks/Database";

export default function Modules() {

    const user = supabase.auth.user()
    const toast = useToast()

    const [modRecords, setModRecords] = useState([]);
    const [isLoading, setIsLoading] = useBoolean();

    useEffect(() => {
        if (user === null)
            setModRecords([])
        else
            fetchUserModules().catch(console.error)
    }, [user])

    const fetchUserModules = async () => {
        setModRecords([])
        setIsLoading.on()

        const userAcadMods = await getUserAcademic(user.id)

        for (var i = 0; i < userAcadMods.length; i++) {
            const modInfo = await getModInfo(userAcadMods[i].module)

            const thisMod = {
                id: userAcadMods[i].id,
                code: modInfo.code,
                name: modInfo.name,
                status: userAcadMods[i].status || "undefined", //fixme
            }

            setModRecords(current => [...current, thisMod])
        }
        setIsLoading.off()
    }

    const handleRefreshRecords = async e => {
        e.preventDefault()
        fetchUserModules().catch(console.error)
    }

    const handleAddRecord = async e => {
        e.preventDefault();
        console.debug("Add Record clicked")
        //TODO
    }

    const handleDeleteRecord = (recordId) => async e => {
        e.preventDefault();

        const { status, error } = await deleteUserAcademicRecord(recordId)

        if (status === 200) {
            // Successful, also delete table row from UI
            var row = document.getElementById(recordId)
            row.parentNode.removeChild(row)
        }

        // Display a toast
        toast({
            title: status === 200 ? "Record Deleted" : "Delete Failed",
            description: status === 200 ? "" : (status === 406 ? "No record to delete" : error.message),
            status: error ? "error" : "success",
            duration: 3000,
            isClosable: true,
        })
    }

    return (
        <>
            <div style={{ display: "flex", margin: "1%", gap: "1%" }}>
                <Tooltip label="Refresh Records">
                    <IconButton
                        backgroundColor="transparent"
                        aria-label='refresh'
                        icon={<RepeatIcon />}
                        onClick={handleRefreshRecords}
                        />
                </Tooltip>
                <Tooltip label="Add New Record">
                    <IconButton
                        backgroundColor="transparent"
                        aria-label='add'
                        icon={<AddIcon />}
                        onClick={handleAddRecord}
                        />
                </Tooltip>
            </div>

            <Skeleton isLoaded={!isLoading}>
                <TableContainer>
                    <Table variant='simple' id="modulesRecords">
                        <TableCaption>{modRecords.length <= 0 ? "No Record Found" : "Your Modules"}</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Module Code</Th>
                                <Th>Module Name</Th>
                                <Th>Status</Th>
                                <Th>{/* Delete Btn */}</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {modRecords.map(item => (
                                <Tr id={item.id}  key={item.id}>
                                    <Td>{item.code}</Td>
                                    <Td>{item.name}</Td>
                                    <Td>{item.status}</Td>
                                    <Td>
                                        <IconButton
                                            backgroundColor="transparent"
                                            aria-label='delete'
                                            size=""
                                            icon={<DeleteIcon />}
                                            onClick={handleDeleteRecord(item.id, this)}
                                        />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Skeleton>
        </>
    );
}