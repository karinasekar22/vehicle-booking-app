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
  Textarea,
  useDisclosure,
  useToast,
  IconButton,
  HStack,
  Select,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon} from "@chakra-ui/icons";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import axios from "api/axios";

function CreateBooking() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const toast = useToast();
  const [vehicle, setVehicle] = useState([]);
  const [driver, setDriver] = useState([]);
  const [approverLv1, setApproverLv1] = useState([]);
  const [approverLv2, setApproverLv2] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    vehicle_id: "",
    driver_id: "",
    start_date: "",
    end_date: "",
    purpose: "",
    location: "",
    approvers: [
      { approver_id: "", level: 1 },
      { approver_id: "", level: 2 },
    ],
  });
  const [editingId, setEditingId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/booking");
      setBookings(response.data.data);
    } catch (error) {
      toast({
        title: "Error loading bookings",
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
    fetchBookings();
    const fetchOptions = async () => {
      try {
        const [vehicleRes, driverRes, res1, res2] = await Promise.all([
          axios.get("/vehicle"),
          axios.get("/driver"),
          axios.get("/user/approvers?level=1"),
          axios.get("/user/approvers?level=2"),
        ]);
        setVehicle(vehicleRes.data.data);
        setDriver(driverRes.data.data);
        setApproverLv1(res1.data.data);
        setApproverLv2(res2.data.data);
      } catch (err) {
        console.error("Failed to fetch all", err);
      }
    };
    fetchOptions();
  }, []);

  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle approvers change
  const handleApproverChange = (index, value) => {
    const newApprovers = [...formData.approvers];
    newApprovers[index].approver_id = value;
    setFormData((prev) => ({ ...prev, approvers: newApprovers }));
  };

  // Submit form add/edit
  const handleSubmit = async () => {
    // Validasi sederhana
    const {
      vehicle_id,
      driver_id,
      start_date,
      end_date,
      purpose,
      location,
      approvers,
    } = formData;

    if (
      !vehicle_id ||
      !driver_id ||
      !start_date ||
      !end_date ||
      !purpose ||
      !location ||
      !Array.isArray(approvers) ||
      approvers.length !== 2 ||
      approvers.some((appr) => !appr.approver_id)
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields and input 2 approvers!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/booking/${editingId}`, formData);
        toast({
          title: "Booking updated",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        await axios.post("/booking", formData);
        toast({
          title: "Booking created",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
      fetchBookings();
      onClose();
      setFormData({
        vehicle_id: "",
        driver_id: "",
        start_date: "",
        end_date: "",
        purpose: "",
        location: "",
        approvers: [
          { approver_id: "", level: 1 },
          { approver_id: "", level: 2 },
        ],
      });
      setEditingId(null);
    } catch (error) {
      toast({
        title: "Error saving booking",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Edit button handler
  const handleEdit = (booking) => {
    setFormData({
      vehicle_id: booking.vehicle_id,
      driver_id: booking.driver_id,
      start_date: booking.start_date ? booking.start_date.split("T")[0] : "",
      end_date: booking.end_date ? booking.end_date.split("T")[0] : "",
      purpose: booking.purpose,
      location: booking.location,
      approvers: booking.approvers || [
        { approver_id: "", level: 1 },
        { approver_id: "", level: 2 },
      ],
    });
    setEditingId(booking.id);
    onOpen();
  };

  // Delete button handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;
    try {
      await axios.delete(`/booking/${id}`);
      toast({
        title: "Booking deleted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      fetchBookings();
    } catch (error) {
      toast({
        title: "Error deleting booking",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  //export
  const {
    isOpen: isExportOpen,
    onOpen: onExportOpen,
    onClose: onExportClose,
  } = useDisclosure();

  const [exportDates, setExportDates] = useState({
    from: "",
    to: "",
  });

  const handleExportChange = (e) => {
    const { name, value } = e.target;
    setExportDates((prev) => ({ ...prev, [name]: value }));
  };

  const handleExport = async () => {
    try{
    const { from, to } = exportDates;
    if (!from || !to) {
      toast({
        title: "Validation Error",
        description: "Please select both From and To dates",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (new Date(from) > new Date(to)) {
      toast({
        title: "Validation Error",
        description: "'From' date cannot be after 'To' date",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const response = await axios.get(`/export/bookings?from=${from}&to=${to}`,{
      responseType : "blob",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `BookingReport-${from}_to_${to}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    onExportClose();
    } catch (err){
      console.error("Export failed", err);
      toast({
        title: "Export Failed",
        description: "Login session migt be expired or export failed",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }} px="20px">
      <HStack>
        <Button
          mb="20px"
          alignSelf="flex-start"
          onClick={() => {
            setEditingId(null);
            setFormData({
              vehicle_id: "",
              driver_id: "",
              start_date: "",
              end_date: "",
              purpose: "",
              location: "",
              approvers: [
                { approver_id: "", level: 1 },
                { approver_id: "", level: 2 },
              ],
            });
            onOpen();
          }}
        >
          Add Booking
        </Button>
        <Button mb="20px" alignSelf="flex-start" onClick={onExportOpen}>
          Export
        </Button>
      </HStack>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Bookings Table
          </Text>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th pl="0px" borderColor={borderColor} color="gray.400">
                  Vehicle
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Driver
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Start Date
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  End Date
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Purpose
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Location
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Approver 1
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Approver 2
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Status
                </Th>
                <Th
                  borderColor={borderColor}
                  color="gray.400"
                  textAlign="center"
                >
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
              ) : bookings.length === 0 ? (
                <Tr>
                  <Td colSpan={9} textAlign="center">
                    No bookings found.
                  </Td>
                </Tr>
              ) : (
                bookings.map((booking) => (
                  <Tr key={booking.id}>
                    <Td borderColor={borderColor}>{booking.Vehicle.name}</Td>
                    <Td borderColor={borderColor}>{booking.Driver.name}</Td>
                    <Td borderColor={borderColor}>
                      {booking.start_date
                        ? new Date(booking.start_date).toLocaleDateString()
                        : ""}
                    </Td>
                    <Td borderColor={borderColor}>
                      {booking.end_date
                        ? new Date(booking.end_date).toLocaleDateString()
                        : ""}
                    </Td>
                    <Td borderColor={borderColor}>{booking.purpose}</Td>
                    <Td borderColor={borderColor}>{booking.location}</Td>
                    <Td borderColor={borderColor}>
                      {booking.Approvals?.find((a) => a.level === 1)?.User
                        ?.name || "N/A"}
                    </Td>
                    <Td borderColor={borderColor}>
                      {booking.Approvals?.find((a) => a.level === 2)?.User
                        ?.name || "N/A"}
                    </Td>
                    <Td borderColor={borderColor}>{booking.status}</Td>
                    <Td borderColor={borderColor} textAlign="center">
                      <HStack spacing="10px" justify="center" mx={4}>
                        <IconButton
                          aria-label="Edit booking"
                          icon={<EditIcon />}
                          size="sm"
                          onClick={() => handleEdit(booking)}
                        />
                        <IconButton
                          aria-label="Delete booking"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(booking.id)}
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
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="lg"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingId ? "Edit Booking" : "Add Booking"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="15px" isRequired>
              <FormLabel>Vehicle</FormLabel>
              <Select
                name="vehicle_id"
                value={formData.vehicle_id}
                onChange={handleChange}
                placeholder="Select vehicle"
              >
                {" "}
                {vehicle.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} - {v.plate_number}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb="15px" isRequired>
              <FormLabel>Driver</FormLabel>
              <Select
                name="driver_id"
                value={formData.driver_id}
                onChange={handleChange}
                placeholder="Select Driver"
              >
                {" "}
                {driver.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} - {d.phone}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb="15px" isRequired>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb="15px" isRequired>
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb="15px" isRequired>
              <FormLabel>Purpose</FormLabel>
              <Textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="Purpose"
              />
            </FormControl>
            <FormControl mb="15px" isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
              />
            </FormControl>
            <FormControl mb="15px" isRequired>
              <FormLabel>Approver Level 1</FormLabel>
              <Select
                placeholder="Select approver"
                name="approver0"
                value={formData.approvers[0]?.approver_id || ""}
                onChange={(e) => handleApproverChange(0, e.target.value)}
              >
                {approverLv1.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb="15px" isRequired>
              <FormLabel>Approver Level 2</FormLabel>
              <Select
                placeholder="Select approver"
                name="approver1"
                value={formData.approvers[1]?.approver_id || ""}
                onChange={(e) => handleApproverChange(1, e.target.value)}
              >
                {approverLv2.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
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

      <Modal isOpen={isExportOpen} onClose={onExportClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Export Booking Report</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="15px" isRequired>
              <FormLabel>From Date</FormLabel>
              <Input
                type="date"
                name="from"
                value={exportDates.from}
                onChange={handleExportChange}
              />
            </FormControl>
            <FormControl mb="15px" isRequired>
              <FormLabel>To Date</FormLabel>
              <Input
                type="date"
                name="to"
                value={exportDates.to}
                onChange={handleExportChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onExportClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleExport}>
              Export
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default CreateBooking;
