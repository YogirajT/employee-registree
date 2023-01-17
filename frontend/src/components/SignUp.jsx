import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { getDepartmentList, signUp } from "../state/actions";
import {
  Alert,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
} from "@mui/material";
import { Link } from "react-router-dom";

const SignUp = (props) => {
  const [department, setDepartment] = React.useState("");

  const [passwordError, setPasswordError] = React.useState(false);

  React.useEffect(() => {
    props.getDepartmentList();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const repeatPassword = data.get("repeat-password").trim();
    const password = data.get("password").trim();

    if (!password) {
      alert("Passwords is required");
      return;
    }

    if (repeatPassword !== password) {
      setPasswordError(true);
      alert("Passwords must match");
      return;
    }

    setPasswordError(false);

    const updatePayload = {
      username: data.get("username").trim(),
      password: data.get("password").trim(),
      first_name: data.get("first_name").trim(),
      last_name: data.get("last_name").trim(),
      job_title: data.get("job_title").trim(),
      address: data.get("address").trim(),
      department: department || null,
    };
    console.log(updatePayload);
    props.signUp(updatePayload);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="repeat-password"
            label="Repeat Password"
            type="password"
            id="repeat-password"
            error={passwordError}
            onChange={() => {
              setPasswordError(false);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="first_name"
            label="First Name"
            name="first_name"
            autoFocus
          />
          <TextField
            margin="normal"
            fullWidth
            id="last_name"
            label="Last Name"
            name="last_name"
            autoFocus
          />
          <TextField
            margin="normal"
            fullWidth
            id="job_title"
            label="Job Title"
            name="job_title"
            autoFocus
          />

          <InputLabel id="department-label">Department</InputLabel>
          <Select
            labelId="department-label"
            id="department"
            defaultValue={department}
            label="Department"
            sx={{ width: "100%" }}
            onChange={(e) => setDepartment(e.target.value || null)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {props?.departmentList &&
              props.departmentList.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.name}
                </MenuItem>
              ))}
          </Select>
          <InputLabel htmlFor="address">Address</InputLabel>
          <TextareaAutosize
            margin="normal"
            fullWidth
            id="address"
            label="Address"
            name="address"
            autoFocus
            style={{ width: "100%" }}
            minRows={3}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          {!!props?.error && <Alert severity="error">{props?.error}</Alert>}
          <Grid container>
            <Grid item>
              <Link to={"/"}>{"Already have an account? Sign In"}</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  error: state.access.error,
  departmentList: state?.access?.departmentList,
});

const mapDispatchToProps = (dispatch) => ({
  signUp: (payload) => dispatch(signUp(payload)),
  getDepartmentList: () => dispatch(getDepartmentList()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUp));
