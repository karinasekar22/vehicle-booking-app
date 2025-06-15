import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
  HStack,
} from "@chakra-ui/react";
import axios from "api/axios";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";

function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/approval");
      setApprovals(res.data.data);
    } catch (err) {
      toast({
        title: "Error loading approvals",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await axios.patch(`/approval/${id}`, { status }); // Ganti path sesuai backend
      toast({
        title: `Booking ${status}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      fetchApprovals();
    } catch (err) {
      toast({
        title: "Failed to update approval",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
     <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px" my={20}>
         <CardHeader p="6px 0px 22px 0px">
                  <Text fontSize="2xl" color={textColor} fontWeight="bold">
                   Pending Approval
                  </Text>
                </CardHeader>
      <Table variant="simple" color={textColor}>
        <Thead>
          <Tr>
            <Th borderColor={borderColor}>Booking ID</Th>
            <Th borderColor={borderColor}>Vehicle</Th>
            <Th borderColor={borderColor}>Driver</Th>
            <Th borderColor={borderColor}>Purpose</Th>
            <Th borderColor={borderColor}>Location</Th>
            <Th borderColor={borderColor}>Start Date</Th>
            <Th borderColor={borderColor}>End Date</Th>
            <Th borderColor={borderColor} textAlign="center">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr>
              <Td colSpan={7} textAlign="center">
                Loading...
              </Td>
            </Tr>
          ) : approvals.length === 0 ? (
            <Tr>
              <Td colSpan={7} textAlign="center">
                No pending approvals.
              </Td>
            </Tr>
          ) : (
            approvals.map((approval) => {
              const booking = approval.Booking || {};
              return (
                <Tr key={approval.id}>
                  <Td borderColor={borderColor}>{booking.id}</Td>
                  <Td borderColor={borderColor}>{booking.Vehicle?.name}</Td>
                  <Td borderColor={borderColor}>{booking.Driver?.name}</Td>
                  <Td borderColor={borderColor}>{booking.purpose}</Td>
                  <Td borderColor={borderColor}>{booking.location}</Td>
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
                  <Td borderColor={borderColor} textAlign="center">
                    <HStack spacing="10px" justify="center">
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={() => handleAction(approval.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleAction(approval.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              );
            })
          )}
        </Tbody>
      </Table>
    </Card>
  );
}

export default Approvals;
