import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { connect } from "react-redux";
import {
  fileDataToUserSaveRequestTransformer,
  userResponseToTableRowsTransformer,
} from "../../utils/transformers";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PagesIcon from "@mui/icons-material/Pages";
import { createUsers, deleteUser, editUser } from "../../state/actions";
import { UserFormModal } from "../modals/EmployeeFormModal";
import { ActionLogModal } from "../modals/ActionLogModal";
import { useRole } from "../../utils/hooks.jsx";
import * as XLSX from "xlsx";
import FileUploadModal from "../modals/FileUploadModal";

export const EmployeeTable = ({
  list: userList,
  editUser,
  createUsers,
  deleteUser,
  departmentList,
  error
}) => {
  const [rows, setRows] = useState([]);

  const { isSuperUser, isAdminUser } = useRole();

  const fileinputRef = useRef(null);

  const [openForm, setOpenForm] = React.useState(false);

  const [, setOpenHistory] = React.useState(false);

  const [editValues, setEditValues] = React.useState(null);

  const [actionLogUserId, setActionLogUserId] = React.useState(null);

  const [department, setDepartment] = React.useState("");

  const [departmentFilter, setDepartmentFilter] = React.useState("");

  const [userUpload, setUserUpload] = React.useState([]);

  const [role, setRole] = React.useState(null);

  const handleOpen = () => setOpenForm(true);

  const handleClose = () => {
    setOpenForm(false);
    setEditValues(null);
    setUserUpload([]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (editValues) {
      const updatePayload = {
        id: editValues.id,
        first_name: data.get("first_name").trim(),
        last_name: data.get("last_name").trim(),
        job_title: data.get("job_title").trim(),
        address: data.get("address").trim(),
        department: department || null,
        ...(isSuperUser ? { role: role || null } : {}),
      };
      editUser(updatePayload);
      return;
    }
    const departmentName =
      departmentList.find((d) => d._id === department)?.name || null;
    const createPayload = {
      first_name: data.get("first_name").trim(),
      last_name: data.get("last_name").trim(),
      job_title: data.get("job_title").trim(),
      address: data.get("address").trim(),
      department: departmentName,
    };
    createUsers([createPayload]);
  };

  useEffect(() => {
    if (userList?.length) {
      setRows(userList.map(userResponseToTableRowsTransformer));
    }
    handleClose();
  }, [userList]);

  const handleDelete = useCallback(
    (id) => {
      deleteUser(id);
    },
    [deleteUser]
  );

  const handleEdit = useCallback(
    (item) => {
      setEditValues(item.row);
      setDepartment(item.row?.department?._id || null);
      if (isSuperUser) {
        setRole(item.row?.role);
      }
      setOpenForm(true);
    },
    [isSuperUser]
  );

  const onFileUpload = async (sender) => {
    const file = sender.target.files[0];
    const fileReader = await new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = (e) => {
      const bufferArray = e?.target.result;
      const wb = XLSX.read(bufferArray, { type: "buffer" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws);

      fileinputRef.current.value = null;
      if (!data || !Array.isArray(data)) {
        alert("Invalid file!");
        return;
      }
      const users = data.map(fileDataToUserSaveRequestTransformer);
      setUserUpload(users);
    };
  };

  const handleViewHistory = useCallback((item) => {
    setEditValues(null);
    setOpenForm(false);
    setOpenHistory(true);
    setActionLogUserId(item);
  }, []);

  const columns = React.useMemo(
    () => [
      { field: "index", headerName: "#", width: 20 },
      { field: "first_name", headerName: "First name", width: 150 },
      { field: "last_name", headerName: "Last name", width: 150 },
      ...(isSuperUser || isAdminUser
        ? [
            {
              field: "role",
              headerName: "Role",
              width: 150,
            },
          ]
        : []),
      { field: "job_title", headerName: "Job title", width: 150 },
      {
        field: "departmentName",
        headerName: "Department",
        valueGetter: (params) => params.row?.department?.name || "",
        width: 150,
      },
      { field: "address", headerName: "Address", flex: 1 },
      {
        field: "action",
        type: "actions",
        width: 30,
        getActions: (params) => [
          ...(isSuperUser || isAdminUser
            ? [
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  showInMenu={true}
                  onClick={() => handleEdit(params)}
                />,
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Delete"
                  showInMenu={true}
                  onClick={() => handleDelete(params.id)}
                />,
              ]
            : []),
          <GridActionsCellItem
            icon={<PagesIcon />}
            label="View Logs"
            showInMenu={true}
            onClick={() => handleViewHistory(params.id)}
          />,
        ],
      },
    ],
    [handleDelete, handleEdit, handleViewHistory, isAdminUser, isSuperUser]
  );

  const fitleredRows = useMemo(
    () =>
      rows
        .filter(
          (row) =>
            !departmentFilter || row?.department?._id === departmentFilter
        )
        .map((row, i) => ({ ...row, index: i + 1 })),
    [departmentFilter, rows]
  );

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
          {fitleredRows.length} - Employee{fitleredRows.length !== 1 ? "s" : ""}{" "}
          {departmentFilter ? "after Filtering" : ""}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <FormControl sx={{ m: 1, minWidth: 300 }}>
            <InputLabel id="department-filter">Filter Department</InputLabel>
            <Select
              labelId="department-filter"
              id="department-filter"
              defaultValue={department}
              label="Filter Department"
              sx={{ width: "100%" }}
              onChange={(e) => setDepartmentFilter(e.target.value || null)}
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
          {isSuperUser || isAdminUser ? (
            <>
              <Button size="small" variant="outlined" component="label">
                Import CSV
                <input
                  type="file"
                  hidden
                  accept=".csv,.xlsx"
                  multiple="false"
                  onChange={onFileUpload}
                  ref={fileinputRef}
                />
              </Button>
              <Button size="small" variant="outlined" onClick={handleOpen}>
                Create
              </Button>
            </>
          ) : null}
        </Box>
      </Box>
      <DataGrid
        rows={fitleredRows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableColumnFilter={true}
      />
      <UserFormModal
        openForm={openForm}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        editValues={editValues}
        department={department}
        setDepartment={setDepartment}
        departmentList={departmentList}
        setRole={setRole}
        role={role}
        error={error}
      />
      <ActionLogModal
        userId={actionLogUserId}
        openLog={!!actionLogUserId}
        handleClose={() => setActionLogUserId(null)}
      />
      <FileUploadModal
        open={!!userUpload.length}
        users={userUpload}
        handleClose={() => {
          setUserUpload([]);
        }}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  list: state.access.userList,
  departmentList: state.access.departmentList,
  error: state.access.error
});

const mapDispatchToProps = (dispatch) => ({
  editUser: (update) => dispatch(editUser(update)),
  createUsers: (payload) => dispatch(createUsers(payload)),
  deleteUser: (id) => dispatch(deleteUser(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeTable);
