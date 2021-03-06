import { useState, useEffect } from 'react';
import {
    Table, Thead, Tbody,
    Th, Tr, Td,
    TableCaption, TableContainer,
    Input, InputGroup, InputRightElement,
    Skeleton, Tooltip,
    Button, IconButton, Switch,
    useBoolean, useToast
} from '@chakra-ui/react';
import {
    CheckIcon,
    CloseIcon,
    RepeatIcon,
    DeleteIcon
} from '@chakra-ui/icons';

import {
    getModInfo,
    getModuleId,
    upsertModule,
    getUserAcademic,
    UserAcademicRecord
} from "../helpers/Database";
import { moduleExist } from "../helpers/NUSModsAPI";
import { supabase } from "../helpers/SupabaseClient";

import { graphData } from '../hooks/GraphData';

export default function ModulesTable() {

    const user = supabase.auth.user()
    const toast = useToast()
    const { isUserModUpdate, setUserModules, userModules } = graphData()

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

    // Actively checks if entered value is a module code that exists
    useEffect(() => {
        if (newRecord.length === 0) {
            setNewModValid() // set to empty
        }
        else moduleExist(newRecord)
            .then(isValid => { setNewModValid(isValid) })
    }, [newRecord])

    // Control the icon for "add module" textbox
    useEffect(() => {
        if (newModValid === undefined || newModValid === null)
            setNewRecordValidIcon()
        else
            setNewRecordValidIcon(newModValid ? <CheckIcon color='green.500' /> : <CloseIcon color='red.500' />)
    }, [newModValid])

    const fetchUserModules = async () => {
        setModRecords([])
        setIsLoading.on()

        const userAcadMods = await getUserAcademic(user.id)
        const graphSemMod = []
        for (var i = 0; i < userAcadMods.length; i++) {
            const modInfo = await getModInfo(userAcadMods[i].module)

            if (modInfo == null)
                continue

            const thisMod = {
                id: userAcadMods[i].id,
                code: modInfo.code,
                name: modInfo.name,
                isCompleted: userAcadMods[i].completed,
            }

            graphSemMod[i] = {
                code: modInfo.code,
                name: modInfo.name,
                isCompleted: userAcadMods[i].completed,
            }

            setModRecords(current => [...current, thisMod])
            //setUserModules(current => [...current, thisMod]) // update graph side variable
        }
        setIsLoading.off()

        // Update Graph
        setUserModules(graphSemMod)
        isUserModUpdate(true)
    }

    const handleRefreshRecords = async e => {
        e.preventDefault()
        fetchUserModules().catch(console.error)
    }

    const handleAddRecord = async e => {
        e.preventDefault();

        // string of current AY in ("20xx/20xy" format)
        const currentYear = new Date().getFullYear()
        const acadYear = currentYear.toString() + "/" + (currentYear + 1).toString()

        // Get the id of the mod from the 'modules' table
        var modId = (await getModuleId(newRecord, acadYear))?.id

        if (modId === undefined || modId == null) {
            // If row does not exist, add new row to the 'modules' table
            modId = await upsertModule(newRecord, acadYear)
        }
        else {
            // If row exist, check if user already has this module
            var hasExisting = false
            const userAcadMods = await getUserAcademic(user.id)
            userAcadMods.map(item => { hasExisting |= (item.module === modId) })

            if (hasExisting) {
                // Display a toast
                toast({
                    title: "Existing record found",
                    description: "No new row added",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                })

                return // stop handling add record
            }
        }

        // Add new records to database
        const result = await UserAcademicRecord.insert(user.id, modId)

        if (result.status === 'error') {
            // Failed to insert new module into user academic
            console.error(result.description)
            toast({
                title: result.title,
                description: result.description,
                status: result.status,
                duration: 5000,
                isClosable: true,
            })

            return // stop handling add record
        }

        // Display a toast
        toast({
            title: "Successful",
            description: newRecord + " added",
            status: result.status,
            duration: 5000,
            isClosable: true,
        })

        // Reload UI table + clear the texbox
        fetchUserModules().catch(console.error)
        setNewRecord("")
    }

    const handleToggleModComplete = async e => {
        e.preventDefault()

        // Update database
        UserAcademicRecord.update(e.target.id, e.target.checked)

        // Update local array variable
        modRecords.map(item => {
            if (item.id == e.target.id)
                item.isCompleted = e.target.checked
        })

        setUserModules ( modRecords)
        isUserModUpdate(true)

        
    }

    const handleDeleteRecord = (recordId) => async e => {
        e.preventDefault();

        // Delete row from database
        const { status, error } = await UserAcademicRecord.delete(recordId)

        if (status === 200) {
            // Successful, also delete table row from UI
            var row = document.getElementById(recordId)
            row.parentNode.removeChild(row)
        }

        fetchUserModules().catch(console.error)

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
                <form onSubmit={handleAddRecord} style={{ display: "flex" }}>
                    <InputGroup>
                        <Input
                            data-testid="modCode-input"
                            placeholder="Module Code"
                            onChange={(e) => { setNewRecord(e.target.value) }}
                            value={newRecord}
                            required />
                        <InputRightElement children={newRecordValidIcon} />
                    </InputGroup>
                    <Button
                        data-testid="add-btn"
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
                                <Th>Completed</Th>
                                <Th>{/* Delete Btn */}</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {modRecords.map(item => (
                                <Tr id={item.id} key={item.id}>
                                    <Td>{item.code}</Td>
                                    <Td>{item.name}</Td>
                                    <Td>
                                        <Switch
                                            id={item.id}
                                            size="lg"
                                            defaultChecked={item.isCompleted}
                                            onChange={(e) => handleToggleModComplete(e)}
                                        />
                                    </Td>
                                    <Td>
                                        <IconButton
                                            backgroundColor="transparent"
                                            aria-label='delete'
                                            size=""
                                            icon={<DeleteIcon />}
                                            onClick={handleDeleteRecord(item.id)}
                                        />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Skeleton>
            
            <div style={{color: "red", userSelect:"none"}}>
                Please click on generate module dependency graph button again if you have added or delete any modules and want to update the Semester Planner
            </div>

        </>
    );
}