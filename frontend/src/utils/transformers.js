export const userResponseToTableRowsTransformer = (user) => {
  return {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    address: user.address,
    role: user.role,
    job_title: user.job_title,
    department: user.department,
  };
};


export const departmentResponseToTableRowsTransformer = (department, i) => {
  return {
    id: department._id,
    name: department.name,
    index: i + 1
  };
};


export const actionLogResponseToTableRowsTransformer = ({ _id, ...rest }) => {
  return {
    id: _id,
    ...rest
  };
};


export const fileDataToUserSaveRequestTransformer = (user, index) => {
  return {
    id: index+1,
    first_name: user.Vorname,
    last_name: user.Nachname || "",
    job_title: user.Position || "",
    department: user.Abteilung || "",
    address: [(user.Nr || ""), (user.Ort || ""), (user.Strasse || ""), (user.PLZ || "")].filter(item => !!item).join(", ")
  };
};