import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { getDepartmentList, userList } from "../state/actions";
import { connect } from "react-redux";
import EmployeeTable from "./tables/EmployeeTable";
import { Switch } from "react-router";
import { PrivateRoute } from "../Routes";
import DepartmentTable from "./tables/DepartmentTable";
import { Link } from "react-router-dom";

const drawerPosition = "left";

const drawerWidth = 240;

const ListWrapper = (props) => {
  React.useEffect(() => {
    props.getUserList();
    props.getDepartmentList();
  }, []);

  const menu = () => (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {[
          {
            name: "Employee List",
            icon: <PersonIcon />,
            url: "/list/employees",
          },
          {
            name: "Department",
            icon: <EngineeringIcon />,
            url: "/list/departments",
          },
        ].map((item) => (
          <Link key={item.name} to={item.url} style={{ textAlign: "center" }}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        anchor={drawerPosition}
        variant="permanent"
        PaperProps={{
          sx: {
            top: "4rem",
          },
        }}
      >
        {menu()}
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Switch>
          <PrivateRoute
            exact={true}
            path="/list/employees"
            component={EmployeeTable}
          />
          <PrivateRoute
            exact={true}
            path="/list/departments"
            component={DepartmentTable}
          />
        </Switch>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  userList: state.access.userList,
});

const mapDispatchToProps = (dispatch) => ({
  getUserList: () => dispatch(userList()),
  getDepartmentList: () => dispatch(getDepartmentList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListWrapper);
