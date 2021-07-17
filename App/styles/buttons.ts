
const base = {

};

const small = {
  paddingHorizontal: 10,
  paddingVertical: 12,
  width: 75
};

const rounded = {
  borderRadius: 50
};

const smallRounded = {
  ...base,
  ...small,
  ...rounded
};

export { base, small, rounded, smallRounded }