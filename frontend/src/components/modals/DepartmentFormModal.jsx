import { Backdrop, Box, Button, Fade,  Modal, TextField } from "@mui/material";
import { modalStyle } from "../../common";

export const DepartmentFormModal = ({
    openForm,
    handleClose,
    handleSubmit,
    editValues,
}) => {
    
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
              id="name"
              label="Name"
              name="name"
              autoFocus
              defaultValue={editValues ? editValues.name : ""}
            />
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
