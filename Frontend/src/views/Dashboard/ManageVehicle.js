import React, { useEffect, useState } from "react";
import {
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Td,
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
  Select,
  useDisclosure,
  useToast,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import axios from "api/axios";

const typeOptions = ["angkutan orang", "angkutan barang"];
const categoryOptions = ["owned", "rented"];
const statusOptions = ["available", "booked", "in use", "in service", "broken"];
const fuelTypeOptions = [
  "solar",
  "bensin",
  "pertalite",
  "pertamax",
  "bio solar",
  "listrik",
  "lainnya",
];

function ManageVehicle() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const toast = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    plate_number: "",
    type: "",
    category: "",
    status: "available",
    service_schedule: "",
    fuel_type: "",
    fuel_consumption: "",
  });
  const [editingId, setEditingId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

//fetch data
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/vehicle');
      setVehicles(response.data.data);
    } catch (error) {
      toast({
        title: "Error loading vehicles",
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
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "name",
      "plate_number",
      "type",
      "category",
      "status",
      "service_schedule",
      "fuel_type",
      "fuel_consumption",
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast({
          title: "Validation Error",
          description: `Field ${field.replace("_", " ")} is required`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    try {
      if (editingId) {
        await axios.put(`/vehicle/${editingId}`, formData);
        toast({
          title: "Vehicle updated",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        await axios.post('/vehicle', formData);
        toast({
          title: "Vehicle added",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
      fetchVehicles();
      onClose();
      setFormData({
        name: "",
        plate_number: "",
        type: "",
        category: "",
        status: "available",
        service_schedule: "",
        fuel_type: "",
        fuel_consumption: "",
      });
      setEditingId(null);
    } catch (error) {
      toast({
        title: "Error saving vehicle",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  //edit
  const handleEdit = (vehicle) => {
    setFormData({
      name: vehicle.name,
      plate_number: vehicle.plate_number,
      type: vehicle.type,
      category: vehicle.category,
      status: vehicle.status,
      service_schedule: vehicle.service_schedule
        ? vehicle.service_schedule.split("T")[0]
        : "",
      fuel_type: vehicle.fuel_type,
      fuel_consumption: vehicle.fuel_consumption,
    });
    setEditingId(vehicle.id);
    onOpen();
  };

  //delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await axios.delete(`/vehicle/${id}`);
      toast({
        title: "Vehicle deleted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      fetchVehicles();
    } catch (error) {
      toast({
        title: "Error deleting vehicle",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }} px="20px">
      <Button
        mb="20px"
        alignSelf="flex-start"
        onClick={() => {
          setEditingId(null);
          setFormData({
            name: "",
            plate_number: "",
            type: "",
            category: "",
            status: "available",
            service_schedule: "",
            fuel_type: "",
            fuel_consumption: "",
          });
          onOpen();
        }}
      >
        Add Vehicle
      </Button>

      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Vehicles Table
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
                  Plate Number
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Type
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Category
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Status
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Service Schedule
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Fuel Type
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Fuel Consumption
                </Th>
                <Th borderColor={borderColor} color="gray.400" textAlign="center">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={9} textAlign="center">
                    Loading...
                  </Td>
                </Tr>
              ) : vehicles.length === 0 ? (
                <Tr>
                  <Td colSpan={9} textAlign="center">
                    No vehicles found.
                  </Td>
                </Tr>
              ) : (
                vehicles.map((vehicle) => (
                  <Tr key={vehicle.id}>
                    <Td borderColor={borderColor}>{vehicle.name}</Td>
                    <Td borderColor={borderColor}>{vehicle.plate_number}</Td>
                    <Td borderColor={borderColor}>{vehicle.type}</Td>
                    <Td borderColor={borderColor}>{vehicle.category}</Td>
                    <Td borderColor={borderColor}>{vehicle.status}</Td>
                    <Td borderColor={borderColor}>
                      {vehicle.service_schedule
                        ? new Date(vehicle.service_schedule).toLocaleDateString()
                        : ""}
                    </Td>
                    <Td borderColor={borderColor}>{vehicle.fuel_type}</Td>
                    <Td borderColor={borderColor}>{vehicle.fuel_consumption}</Td>
                    <Td borderColor={borderColor} textAlign="center">
                      <HStack spacing="10px" justify="center">
                        <IconButton
                          aria-label="Edit vehicle"
                          icon={<EditIcon />}
                          size="sm"
                          onClick={() => handleEdit(vehicle)}
                        />
                        <IconButton
                          aria-label="Delete vehicle"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(vehicle.id)}
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
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingId ? "Edit Vehicle" : "Add Vehicle"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="15px" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Vehicle name"
              />
            </FormControl>
            <FormControl mb="15px" isRequired>
              <FormLabel>Plate Number</FormLabel>
              <Input
                name="plate_number"
                value={formData.plate_number}
                onChange={handleChange}
                placeholder="Plate number"
              />
            </FormControl>
            <FormControl mb="15px" isRequired>
              <FormLabel>Type</FormLabel>
              <Select name="type" value={formData.type} onChange={handleChange} placeholder="Select type">
                {typeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb="15px" isRequired>
              <FormLabel>Category</FormLabel>
              <Select name="category" value={formData.category} onChange={handleChange} placeholder="Select category">
                {categoryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb="15px" isRequired>
              <FormLabel>Status</FormLabel>
              <Select name="status" value={formData.status} onChange={handleChange} placeholder="Select status">
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb="15px" isRequired>
              <FormLabel>Service Schedule</FormLabel>
              <Input
                type="date"
                name="service_schedule"
                value={formData.service_schedule}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb="15px" isRequired>
              <FormLabel>Fuel Type</FormLabel>
              <Select name="fuel_type" value={formData.fuel_type} onChange={handleChange} placeholder="Select fuel type">
                {fuelTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb="15px" isRequired>
              <FormLabel>Fuel Consumption</FormLabel>
              <Input
                type="number"
                name="fuel_consumption"
                value={formData.fuel_consumption}
                onChange={handleChange}
                placeholder="Fuel consumption"
                step="0.01"
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

export default ManageVehicle;
