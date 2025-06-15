import React, { useEffect, useState } from "react";
import {
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
  IconButton,
  HStack,
  Td
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import axios from "api/axios"; 

function ManageDriver() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const toast = useToast();

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [editingId, setEditingId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  //fetch data
  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/driver');
      setDrivers(response.data.data); 
    } catch (error) {
      toast({
        title: "Error loading drivers",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //handleSubmit
  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      toast({
        title: "Validation Error",
        description: "Name and phone are required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (editingId) {
        // Edit 
        await axios.put(`driver/${editingId}`, formData);
        toast({
          title: "Driver updated",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        // Add
        await axios.post('driver/', formData);
        toast({
          title: "Driver added",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
      fetchDrivers();
      onClose();
      setFormData({ name: "", phone: "" });
      setEditingId(null);
    } catch (error) {
      toast({
        title: "Error saving driver",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle edit button
  const handleEdit = (driver) => {
    setFormData({ name: driver.name, phone: driver.phone });
    setEditingId(driver.id);
    onOpen();
  };

  // Handle delete button
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;
    try {
      await axios.delete(`driver/${id}`);
      toast({
        title: "Driver deleted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      fetchDrivers();
    } catch (error) {
      toast({
        title: "Error deleting driver",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }} px="20px">
      <Button mb="20px" alignSelf="flex-start" onClick={() => { setEditingId(null); setFormData({ name: "", phone: "" }); onOpen(); }}>
        Add Driver
      </Button>

      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            List Driver
          </Text>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th pl="0px" borderColor={borderColor} color="gray.400">
                  Name
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Phone
                </Th>
                <Th borderColor={borderColor} color="gray.400" textAlign="center">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={3} textAlign="center">
                    Loading...
                  </Td>
                </Tr>
              ) : drivers.length === 0 ? (
                <Tr>
                  <Td colSpan={3} textAlign="center">
                    No drivers found.
                  </Td>
                </Tr>
              ) : (
                drivers.map((driver) => (
                  <Tr key={driver.id}>
                    <Td borderColor={borderColor}>{driver.name}</Td>
                    <Td borderColor={borderColor}>{driver.phone}</Td>
                    <Td borderColor={borderColor} textAlign="center">
                      <HStack spacing="10px" justify="center">
                        <IconButton
                          aria-label="Edit driver"
                          icon={<EditIcon />}
                          size="sm"
                          onClick={() => handleEdit(driver)}
                        />
                        <IconButton
                          aria-label="Delete driver"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(driver.id)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Modal Form Add/Edit */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingId ? "Edit Driver" : "Add Driver"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="15px" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Driver name"
              />
            </FormControl>
            <FormControl mb="15px" isRequired>
              <FormLabel>Phone</FormLabel>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {editingId ? "Update" : "Add"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default ManageDriver;
