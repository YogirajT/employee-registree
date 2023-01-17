import { Backdrop, Box, Fade, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { get } from "../../utils";
import { ActionLogTable } from "../tables/ActionLogTable";
import { actionLogResponseToTableRowsTransformer } from "../../utils/transformers";
import { logModalStyle } from "../../common";

export const ActionLogModal = ({ openLog, handleClose, userId }) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (userId) {
      get(`/users/${userId}/action-logs`)
        .then((result) => {
          setRows(result.data.map(actionLogResponseToTableRowsTransformer));
        })
        .catch(() => {});
    }
  }, [userId]);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openLog}
      onClose={handleClose}
      closeAfterTransition
      slotProps={{ backdrop: Backdrop, timeout: 500 }}
    >
      <Fade in={openLog}>
        <Box style={logModalStyle}>
          <ActionLogTable rows={rows} />
        </Box>
      </Fade>
    </Modal>
  );
};
