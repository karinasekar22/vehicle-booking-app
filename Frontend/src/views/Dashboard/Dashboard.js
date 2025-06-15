// Chakra imports
import {React, useEffect, useState} from "react";
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import ApexCharts from "react-apexcharts";
import Card from "components/Card/Card.js";
import axios from "api/axios";

export default function Dashboard() {
  const textColor = useColorModeValue("gray.700", "white");
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get("/booking/usage");
      const fetchedData = res.data.data;

      setSeries([
        {
          name: "Jumlah Booking",
          data: fetchedData.map((d) => d.total),
        },
      ]);

      setOptions({
        chart: { type: "bar" },
        xaxis: {
          categories: fetchedData.map((d) => d.vehicle),
        },
        colors: ["#4FD1C5"],
      });
    } catch (err) {
      console.error("Failed to fetch chart data", err);
    }
  };
  fetchData();
}, []);


  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
      <Card p="0px" maxW={{ sm: "320px", md: "100%" }}>
        <Flex direction="column" mb="40px" p="28px 0px 0px 22px">
          <Text color="gray.400" fontSize="sm" fontWeight="bold" mb="6px">
            PERFORMANCE
          </Text>
          <Text color={textColor} fontSize="lg" fontWeight="bold">
            Total orders
          </Text>
        </Flex>
        <Box minH="300px">
          <ApexCharts options={options} series={series} type="bar" height={300} />
        </Box>
      </Card>
    </Flex>
  );
}
