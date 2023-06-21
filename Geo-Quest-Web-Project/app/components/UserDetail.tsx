import { Box, Heading, HStack, Pressable, Skeleton, Stack, Text } from "native-base";
import React from "react";
import { User } from "../types/User";
import { BaseProps } from "../types/PageProps";
import { Image } from "react-native";
import { getAvatarFromUsername } from "../utils/Avatar";

export const UserDetail = (props: UserDetailProps) => {
    const {
        user,
        score,
        rank
    } = props;
    //https://docs.nativebase.io/building-footer-tabs

    return (//https://docs.nativebase.io/building-swipe-list
        <Pressable width={"100%"} rounded={"lg"} overflow={"hidden"} backgroundColor={"secondary.100"}>
            <Stack direction="row" p="2" alignItems="center" space={3}>
                <Box height={12} width={12}>
                    <Image style={{
                        width: "100%",
                        height: "100%",
                    }} source={getAvatarFromUsername(user?.username ?? "")} alt="avatar" />
                </Box>
                <Stack space={2}>
                    <HStack space={2} alignItems="center" justifyContent="space-between">
                        <Heading size="md">
                            {user?.username ?? ""}
                        </Heading>
                        <Text fontSize="xs" color={"secondary.500"} fontWeight="500">
                            Member since {(new Date(user?.creationDate ?? 0)).getFullYear()}
                        </Text>
                    </HStack>

                    <HStack space={2} alignItems={'center'}>
                        <Text fontWeight="400">
                            QR Founds :
                        </Text>
                        {
                            score === undefined ? <Skeleton width={10} height={3} />
                                : <Text fontWeight="400">
                                    {score}
                                </Text>
                        }
                    </HStack>
                </Stack>
                <Text color={"coolGray.500"} fontSize="3xl" fontWeight="500" marginLeft={"auto"} marginRight={5}>
                    {
                        rank === undefined ? "" : `#${rank}`
                    }
                </Text>
            </Stack>
        </Pressable>
    )
}

export type UserDetailProps = {
    user?: User,
    rank?: number,
    score?: number,
} & BaseProps;