import { useState, useEffect } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Th, Tr, Td,
    TableCaption,
    TableContainer,
    Skeleton,
    useBoolean
} from '@chakra-ui/react';

import { supabase } from "../supabaseClient";
import { getUserAcademic, getModInfo } from "../hooks/Database";

export default function Modules() {

    const user = supabase.auth.user()

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useBoolean();

    useEffect(() => {
        const fetchUserModules = async () => {
            setData([])
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

                setData(current => [...current, thisMod])
            }
            setIsLoading.off()
        }
        fetchUserModules().catch(console.error)
    }, [])

    useEffect(() => {
        if (user === null)
            setData([])
    }, [user])

    return (
        <>
            <Skeleton isLoaded={!isLoading}>
                <TableContainer>
                    <Table variant='simple'>
                        <TableCaption>Your Modules</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Module Code</Th>
                                <Th>Module Name</Th>
                                <Th>Status</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data.map(item => (
                                <Tr key={item.id}>
                                    <Td>{item.code}</Td>
                                    <Td>{item.name}</Td>
                                    <Td>{item.status}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Skeleton>
        </>
    );
}