import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export const FileUploadUsersTable = ({ rows }) => {
  const columns = React.useMemo(
    () => [
      {
        field: "action",
        headerName: "",
        width: 50,
        renderCell: (params) => {
          return params.row.first_name ? <CheckIcon htmlColor="green"/> : <CloseIcon htmlColor="red"/>
        }
      },
      {
        field: "first_name",
        headerName: "First Name",
        width: 150,
      },
      {
        field: "last_name",
        headerName: "Last Name",
        width: 150,
      },
      {
        field: "job_title",
        headerName: "Job Title",
        width: 150,
      },
      {
        field: "department",
        headerName: "department",
        width: 100,
      },
      {
        field: "address",
        headerName: "Address",
        flex: 1,
      },
    ],
    []
  );

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableColumnFilter={true}
      />
    </div>
  );
};
