import { useState, useEffect } from 'react';
import {
    Table, Thead, Tbody,
    Th, Tr, Td,
    TableCaption, TableContainer,
    Input, InputGroup, InputRightElement,
    Skeleton, Tooltip,
    Button, IconButton,
    useBoolean, useToast
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, RepeatIcon, DeleteIcon } from '@chakra-ui/icons';

import { supabase } from "../supabaseClient";
import {
    getModInfo,
    getUserAcademic, 
    deleteUserAcademicRecord
} from "../hooks/Database";
import { moduleExist } from "../hooks/NUSModsAPI"

export default function ModulesTable() {

    const user = supabase.auth.user()
    const toast = useToast()

    const [newRecord, setNewRecord] = useState("");
    const [newModValid, setNewModValid] = useState();
    const [newRecordValidIcon, setNewRecordValidIcon] = useState();

    const [modRecords, setModRecords] = useState([]);
    const [isLoading, setIsLoading] = useBoolean();

    useEffect(() => {
        if (user === null)
            setModRecords([])
        else
            fetchUserModules().catch(console.error)
    }, [user])

    useEffect(() => {
        if (newRecord.length === 0) {
            setNewModValid() // set to empty
        }
        else moduleExist(newRecord)
            .then(isValid => {setNewModValid(isValid)})
    }, [newRecord])

    useEffect(() => {
        if (newModValid === undefined || newModValid === null)
            setNewRecordValidIcon()
        else if (newModValid)
            setNewRecordValidIcon(<CheckIcon color='green.500' />)
        else
            setNewRecordValidIcon(<CloseIcon color='red.500' />)
    }, [newModValid])

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
        console.debug("Add Record:", newRecord)
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
                <form onSubmit={handleAddRecord} style={{display: "flex"}}>
                    <InputGroup>
                        <Input
                            placeholder="Module Code"
                            onChange={(e) => {setNewRecord(e.target.value)}}
                            value={newRecord}
                            required />
                        <InputRightElement children={newRecordValidIcon} />
                    </InputGroup>
                    <Button
                        type="submit"
                        colorScheme='blue'
                        disabled={!newModValid}>
                        Add
                    </Button>
                </form>
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