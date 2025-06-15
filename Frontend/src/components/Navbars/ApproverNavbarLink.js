import {
  Flex,
  Stack,
  Box,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import { ArgonLogoDark, ArgonLogoLight, ChakraLogoDark, ChakraLogoLight } from "components/Icons/Icons";
// Custom Components
import { SidebarResponsive } from "components/Sidebar/Sidebar";
import React from "react";
import routes from "routes.js";

export default function HeaderLinks(props) {
  const { fixed, scrolled, secondary, ...rest } = props;
  const { colorMode } = useColorMode();

  // Filter routes hanya yang layout = "/approver"
  const approverRoutes = routes.filter(route => route.layout === "/approver" || (route.views && route.views.some(v => v.layout === "/approver")));

  // Jika ada kategori atau collapse, Anda bisa buat fungsi filter rekursif jika perlu,
  // tapi jika struktur sederhana, filter di atas sudah cukup.

  // Chakra Color Mode
  let navbarIcon =
    fixed && scrolled
      ? useColorModeValue("gray.700", "gray.200")
      : useColorModeValue("white", "gray.200");
  if (secondary) {
    navbarIcon = "white";
  }

  return (
    <Flex
      pe={{ sm: "0px", md: "16px" }}
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
      {...rest}
    >
      <SidebarResponsive
        hamburgerColor={"white"}
        logo={
          <Stack direction="row" spacing="12px" align="center" justify="center">
            {colorMode === "dark" ? (
              <ArgonLogoLight w="74px" h="27px" />
            ) : (
              <ArgonLogoDark w="74px" h="27px" />
            )}
            <Box
              w="1px"
              h="20px"
              bg={colorMode === "dark" ? "white" : "gray.700"}
            />
            {colorMode === "dark" ? (
              <ChakraLogoLight w="82px" h="21px" />
            ) : (
              <ChakraLogoDark w="82px" h="21px" />
            )}
          </Stack>
        }
        colorMode={colorMode}
        secondary={secondary}
        routes={approverRoutes}
      />
    </Flex>
  );
}
