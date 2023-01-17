import React from "react";
import { DataGrid } from "@mui/x-data-grid";

export const ActionLogTable = ({ rows }) => {
  const columns = React.useMemo(
    () => [
      {
        field: "changedFrom",
        headerName: "Changed from",
        valueGetter: (params) => params?.row?.data.changed_from,
        width: 150,
      },
      {
        field: "changedTo",
        headerName: "Changed to",
        valueGetter: (params) => params?.row?.data.changed_to,
        width: 150,
      },
      {
        field: "changedBy",
        headerName: "Changed By",
        valueGetter: (params) => params?.row?.data.changed_by,
        width: 150,
      },
      {
        field: "changedAt",
        headerName: "Changed At",
        valueGetter: (params) => params?.row?.created_at,
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
