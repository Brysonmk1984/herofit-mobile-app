const base = {
  display: "flex",
  padding: 12,
  paddingTop: 16,
  paddingBottom: 16,
  fontSize: 12,
  fontWeight: 400,
  lineHeight: 1.43,
  borderRadius: 4,
  marginBottom: 0,
  marginLeft: 8,
  marginRight: 8,
};

const infoStyle = {
  color: "#0D3d61",
  backgroundColor: "#64b5f6",
};

const successStyle = {
  color: "#1E4620",
  backgroundColor: "#81c784",
};

const warningStyle = {
  color: "#663C00",
  backgroundColor: "#ffb74d",
};

const errorStyle = {
  color: "#611A15",
  backgroundColor: "#f44336",
};

const info = { ...base, ...infoStyle };
const success = { ...base, ...successStyle };
const warning = { ...base, ...warningStyle };
const error = { ...base, ...errorStyle };

export default { info, success, warning, error };
