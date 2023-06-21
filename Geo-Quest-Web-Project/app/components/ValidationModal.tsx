import { Button, HStack, Heading, Modal, Text } from "native-base";
import { Action } from "./List";

export const ValidationModal = (props: ValidationModelProps) => {

    const {
        label,
        action,
        onClose,
        showModal,
        setShowModal
    } = props;
    
    return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content w={"90%"}>
                <Modal.Body>
                    <Heading size="md" fontWeight="400" color="coolGray.800" _dark={{
                        color: "warmGray.50"
                    }}>
                        Are you sure?
                    </Heading>
                    <Text mt={2}>
                        This action cannot be undone. Are you sure you want to continue?
                    </Text>
                    <HStack alignItems="center" space={2} width={"100%"} px="2" pb={0} pt={3}>
                        <Button rounded={"md"} size={"lg"} testID="submit" flex={1} variant={"outline"} colorScheme="secondary" onPress={() => {
                            setShowModal(false);
                        }}>
                            Cancel
                        </Button>
                        <Button rounded={"md"} size={"lg"} testID="submit" flex={1} variant={"ghost"} colorScheme="black" onPress={() => {
                            action.onClick();
                            setShowModal(false);
                            onClose();
                        }}>
                            {label}
                        </Button>
                    </HStack>
                </Modal.Body>
            </Modal.Content>
        </Modal>
)
}
export type ValidationModelProps = {
    label: string;
    action: Action;
    onClose: () => void;
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;

}