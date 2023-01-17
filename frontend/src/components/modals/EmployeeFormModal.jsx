import {
  Alert,
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { modalStyle } from "../../common";
import { UserRole } from "@employee-registree/config";
import { useRole } from "../../utils/hooks.jsx";

export const UserFormModal = ({
  openForm,
  handleClose,
  handleSubmit,
  editValues,
  department,
  setDepartment,
  departmentList,
  setRole,
  error
}) => {
  const { isSuperUser } = useRole();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openForm}
      onClose={handleClose}
      closeAfterTransition
      slotProps={{ backdrop: Backdrop, timeout: 500 }}
    >
      <Fade in={openForm}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          style={modalStyle}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="first_name"
            label="First Name"
            name="first_name"
            autoFocus
            defaultValue={editValues ? editValues.first_name : ""}
          />
          <TextField
            margin="normal"
            fullWidth
            id="last_name"
            label="Last Name"
            name="last_name"
            autoFocus
            defaultValue={editValues ? editValues.last_name : ""}
          />
          <TextField
            margin="normal"
            fullWidth
            id="job_title"
            label="Job Title"
            name="job_title"
            autoFocus
            defaultValue={editValues ? editValues.job_title : ""}
          />

          <FormControl sx={{ width: "100%" }}>
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
              {departmentList.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
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
            defaultValue={editValues ? editValues.address : ""}
          />

          {isSuperUser && (
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="department-label">Role</InputLabel>
              <Select
                labelId="department-label"
                id="department"
                defaultValue={department}
                label="Department"
                sx={{ width: "100%" }}
                onChange={(e) => setRole(e.target.value || null)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={UserRole.SUPER}>{UserRole.SUPER}</MenuItem>
                <MenuItem value={UserRole.ADMIN}>{UserRole.ADMIN}</MenuItem>
              </Select>
            </FormControl>
          )}
          {!!error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {editValues ? "Update" : "Create"}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};
