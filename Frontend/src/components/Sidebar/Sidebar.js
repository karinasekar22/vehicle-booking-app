/*eslint-disable*/
import { HamburgerIcon } from "@chakra-ui/icons";
// chakra imports
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  renderThumbDark,
  renderThumbLight,
  renderTrack,
  renderView,
} from "components/Scrollbar/Scrollbar";
import { HSeparator } from "components/Separator/Separator";
import React from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { NavLink, useLocation } from "react-router-dom";

// FUNCTIONS

function Sidebar(props) {
  const location = useLocation();
  const mainPanel = React.useRef();
  let variantChange = "0.2s linear";

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    window.location.href = "/auth/signin";
  };

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) =>
    location.pathname === routeName ? "active" : "";

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    // Chakra Color Mode
    let activeBg = useColorModeValue("white", "navy.700");
    let activeColor = useColorModeValue("gray.700", "white");
    let inactiveColor = useColorModeValue("gray.400", "gray.400");
    let sidebarActiveShadow = "0px 7px 11px rgba(0, 0, 0, 0.04)";
    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.category) {
        return (
          <React.Fragment key={prop.name}>
            <Text
              color={activeColor}
              fontWeight="bold"
              mb={{ xl: "6px" }}
              mx="auto"
              ps={{ sm: "10px", xl: "16px" }}
              py="12px"
            >
              {prop.name}
            </Text>
            {createLinks(prop.views)}
          </React.Fragment>
        );
      }
      return (
        <NavLink to={prop.layout + prop.path} key={key}>
          {activeRoute(prop.layout + prop.path) === "active" ? (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              boxShadow={sidebarActiveShadow}
              bg={activeBg}
              transition={variantChange}
              mb={{ xl: "6px" }}
              mx={{ xl: "auto" }}
              ps={{ sm: "10px", xl: "16px" }}
              py="12px"
              borderRadius="15px"
              _hover="none"
              w="100%"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "0px 7px 11px rgba(0, 0, 0, 0.04)",
              }}
            >
              <Flex>
                <Text color={activeColor} my="auto" fontSize="sm">
                  {prop.name}
                </Text>
              </Flex>
            </Button>
          ) : (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              bg="transparent"
              mb={{ xl: "6px" }}
              mx={{ xl: "auto" }}
              py="12px"
              ps={{ sm: "10px", xl: "16px" }}
              borderRadius="15px"
              _hover="none"
              w="100%"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
            >
              <Flex>
                <Text color={inactiveColor} my="auto" fontSize="sm">
                  {prop.name}
                </Text>
              </Flex>
            </Button>
          )}
        </NavLink>
      );
    });
  };

  const { logo, routes } = props;
  const links = <>{createLinks(routes)}</>;

  //  BRAND
  let sidebarBg = useColorModeValue("white", "navy.800");
  let sidebarRadius = "20px";
  let sidebarMargins = "0px";
  const brand = (
    <Box pt={"25px"} mb="12px">
      {logo}
      <HSeparator my="26px" />
    </Box>
  );

  // SIDEBAR
  return (
    <Box ref={mainPanel}>
      <Box display={{ sm: "none", xl: "block" }} position="fixed">
        <Box
          bg={sidebarBg}
          transition={variantChange}
          w="260px"
          maxW="260px"
          ms={{ sm: "16px" }}
          my={{ sm: "16px" }}
          h="calc(100vh - 32px)"
          ps="20px"
          pe="20px"
          m={sidebarMargins}
          filter="drop-shadow(0px 5px 14px rgba(0, 0, 0, 0.05))"
          borderRadius={sidebarRadius}
        >
          <Scrollbars
            autoHide
            renderTrackVertical={renderTrack}
            renderThumbVertical={useColorModeValue(
              renderThumbLight,
              renderThumbDark
            )}
            renderView={renderView}
          >
            <Box>{brand}</Box>
            <Stack direction="column" mb="40px">
              <Box>{links}</Box>
            </Stack>
            <Button
              onClick={handleLogout}
              colorScheme="red"
              width="50%"
              mb="20px"
              alignSelf="start"
            >
              Logout
            </Button>
          </Scrollbars>
        </Box>
      </Box>
    </Box>
  );
}
export default Sidebar;
// SidebarResponsive
export function SidebarResponsive(props) {
  const location = useLocation();
  const { logo, routes, hamburgerColor, ...rest } = props;
  const mainPanel = React.useRef();
  const activeRoute = (routeName) =>
    location.pathname === routeName ? "active" : "";
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.href = "/auth/signin";
  };

  let activeBg = useColorModeValue("white", "navy.700");
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue("gray.400", "white");
  let sidebarActiveShadow = useColorModeValue(
    "0px 7px 11px rgba(0, 0, 0, 0.04)",
    "none"
  );
  let sidebarBackgroundColor = useColorModeValue("white", "navy.800");

  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.category) {
        return (
          <React.Fragment key={prop.name}>
            <Text
              color={activeColor}
              fontWeight="bold"
              mb={{ xl: "6px" }}
              mx="auto"
              ps={{ sm: "10px", xl: "16px" }}
              py="12px"
            >
              {prop.name}
            </Text>
            {createLinks(prop.views)}
          </React.Fragment>
        );
      }
      return (
        <NavLink to={prop.layout + prop.path} key={key}>
          {activeRoute(prop.layout + prop.path) === "active" ? (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              bg={activeBg}
              boxShadow={sidebarActiveShadow}
              mb={{ xl: "6px" }}
              mx={{ xl: "auto" }}
              ps={{ sm: "10px", xl: "16px" }}
              py="12px"
              borderRadius="15px"
              _hover="none"
              w="100%"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
            >
              <Flex>
                <Text color={activeColor} my="auto" fontSize="sm">
                  {prop.name}
                </Text>
              </Flex>
            </Button>
          ) : (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              bg="transparent"
              mb={{ xl: "6px" }}
              mx={{ xl: "auto" }}
              py="12px"
              ps={{ sm: "10px", xl: "16px" }}
              borderRadius="15px"
              _hover="none"
              w="100%"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
            >
              <Flex>
                <Text color={inactiveColor} my="auto" fontSize="sm">
                  {prop.name}
                </Text>
              </Flex>
            </Button>
          )}
        </NavLink>
      );
    });
  };

  const links = <>{createLinks(routes)}</>;

  const brand = (
    <Box pt={"35px"} mb="8px">
      {logo}
      <HSeparator my="26px" />
    </Box>
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <Flex
      display={{ sm: "flex", xl: "none" }}
      ref={mainPanel}
      alignItems="center"
    >
      <HamburgerIcon
        color={hamburgerColor}
        w="18px"
        h="18px"
        ref={btnRef}
        onClick={onOpen}
      />
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="left"
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent
          w="250px"
          maxW="250px"
          ms={{ sm: "16px" }}
          my={{ sm: "16px" }}
          borderRadius="16px"
          bg={sidebarBackgroundColor}
        >
          <DrawerCloseButton
            _focus={{ boxShadow: "none" }}
            _hover={{ boxShadow: "none" }}
          />
          <DrawerBody maxW="250px" px="1rem">
            <Box maxW="100%" h="100vh">
              <Box>{brand}</Box>
              <Stack direction="column" mb="40px">
                <Box>{links}</Box>
              </Stack>
              <Button
                onClick={handleLogout}
                colorScheme="red"
                width="50%"
                mb="20px"
              >
                Logout
              </Button>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}


