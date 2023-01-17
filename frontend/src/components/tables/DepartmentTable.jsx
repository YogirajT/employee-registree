import React, { useCallback, useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import { connect } from "react-redux";
import { departmentResponseToTableRowsTransformer } from "../../utils/transformers";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  createDepartment,
  deleteDepartment,
  editDepartment,
} from "../../state/actions";
import { DepartmentFormModal } from "../modals/DepartmentFormModal";
import { useRole } from "../../utils/hooks.jsx";

export const DepartmentTable = ({
  list,
  createDepartment,
  deleteDepartment,
  editDepartment,
}) => {
  const [rows, setRows] = useState([]);

  const [openForm, setOpenForm] = React.useState(false);

  const [editValues, setEditValues] = React.useState(null);

  const { isSuperUser, isAdminUser } = useRole();

  const handleOpen = () => setOpenForm(true);

  const handleClose = () => {
    setOpenForm(false);
    setEditValues(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (editValues) {
      editDepartment({ id: editValues.id, name: data.get("name").trim() });
      return;
    }
    createDepartment(data.get("name").trim());
  };

  const handleDelete = useCallback(
    (id) => {
      deleteDepartment(id);
    },
    [deleteDepartment]
  );

  const handleEdit = useCallback((item) => {
    setEditValues(item.row);
    setOpenForm(true);
  }, []);

  const columns = React.useMemo(
    () => [
      { field: "index", headerName: "#", width: 20 },
      { field: "name", headerName: "Department name", flex: 1 },
      ...(isSuperUser || isAdminUser
        ? [
            {
              field: "actiona",
              type: "actions",
              width: 100,
              getActions: (params) => [
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  onClick={() => handleEdit(params)}
                />,
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Delete"
                  onClick={() => handleDelete(params.id)}
                />,
              ],
            },
          ]
        : []),
    ],
    [handleDelete, handleEdit, isAdminUser, isSuperUser]
  );

  useEffect(() => {
    if (Array.isArray(list)) {
      setRows(list.map(departmentResponseToTableRowsTransformer));
    }
    handleClose();
  }, [list]);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Box
        mb={1}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Departments
        </Typography>
        {isSuperUser || isAdminUser ? (
          <Button size="small" variant="outlined" onClick={handleOpen}>
            Create
          </Button>
        ) : null}
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableColumnFilter={true}
      />
      <DepartmentFormModal
        openForm={openForm}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        editValues={editValues}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  list: state.access.departmentList,
});

const mapDispatchToProps = (dispatch) => ({
  createDepartment: (name) => dispatch(createDepartment(name)),
  deleteDepartment: (id) => dispatch(deleteDepartment(id)),
  editDepartment: (update) => dispatch(editDepartment(update)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentTable);
