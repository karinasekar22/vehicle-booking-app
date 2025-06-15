import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import ApproverLayout  from "layouts/Approver.js";
import { ChakraProvider } from "@chakra-ui/react";
// Custom Chakra theme
import theme from "theme/theme.js";

ReactDOM.render(
  <ChakraProvider theme={theme} resetCss={false} position="relative">
    <Router>
      <Switch>
        <Route path="/auth/*" component={AuthLayout} />
        <Route path="/admin/*" component={AdminLayout} />
        <Route path="/approver/*" component={ApproverLayout} />
        <Redirect from="/" to="/auth/signin" />
      </Switch>
    </Router>
  </ChakraProvider>,
  document.getElementById("root")
);
