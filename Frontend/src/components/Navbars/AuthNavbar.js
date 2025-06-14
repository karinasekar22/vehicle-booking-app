import {
  Box,
  Flex,
  Link,
  Stack,
  Text,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import {
  ArgonLogoDark,
  ArgonLogoLight,
  ChakraLogoBlue
} from "components/Icons/Icons";
import React from "react";

export default function AuthNavbar(props) {
  const { logoText } = props;
  const { colorMode } = useColorMode();
  let mainText = "white";

  // Komponen logo
  let brand = (
    <Link
      href={`${process.env.PUBLIC_URL}/#/`}
      target="_blank"
      display="flex"
      lineHeight="100%"
      fontWeight="bold"
      justifyContent="center"
      alignItems="center"
      color={mainText}
    >
      <Stack direction="row" spacing="12px" align="center" justify="center">
        <ArgonLogoLight w="74px" h="27px" />
        <Box w="1px" h="20px" bg={"white"} />
        <ChakraLogoBlue w="82px" h="21px" />
      </Stack>
      <Text fontSize="sm" mt="3px">
        {logoText}
      </Text>
    </Link>
  );

  return (
    <Flex
      position="absolute"
      top="16px"
      left="50%"
      transform="translate(-50%, 0px)"
      background="none"
      border="none"
      boxShadow="initial"
      filter="initial"
      backdropFilter="none"
      borderRadius="15px"
      px="16px"
      py="22px"
      mx="auto"
      width="1044px"
      maxW="90%"
      alignItems="center"
      zIndex="3"
    >
      <Flex w="100%" justifyContent={{ sm: "start", lg: "center" }}>
        {brand}
      </Flex>
    </Flex>
  );
}
