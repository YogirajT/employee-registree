import { Alert, Backdrop, Box, Button, Fade, Modal } from "@mui/material";
import { importModalStyle } from "../../common";
import { FileUploadUsersTable } from "../tables/FileUploadUsersTable";
import { connect } from "react-redux";
import { createUsers } from "../../state/actions";

const FileUploadModal = ({ users, open, handleClose, createUsers, error }) => {

  const handleSubmit = () => {
    createUsers(users.filter((user) => !!user.first_name));
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slotProps={{ backdrop: Backdrop, timeout: 500 }}
    >
      <Fade in={open}>
        <Box style={importModalStyle}>
          {!!error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <FileUploadUsersTable rows={users} />
          <Alert severity="warning" sx={{ mt: 2 }}>
            First name is compulsory. Only users with a tick will be imported.
          </Alert>
          <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
            <Button size="small" variant="outlined" onClick={handleClose}>
              Close
            </Button>
            <Button size="small" variant="contained" onClick={handleSubmit}>
              Create
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  list: state.access.userList,
  departmentList: state.access.departmentList,
  error: state.access.error,
});

const mapDispatchToProps = (dispatch) => ({
  createUsers: (payload) => dispatch(createUsers(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FileUploadModal);
