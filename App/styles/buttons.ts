import { primaryButton as cPrimaryButton, secondaryButton as cSecondaryButton } from "./colors";

const base = {
  paddingHorizontal: 10,
  paddingVertical: 12,
};
const primary = {
  backgroundColor : cPrimaryButton.backgroundColor,
  color : cPrimaryButton.color
};
const secondary = {
  backgroundColor : cSecondaryButton.backgroundColor,
  color : cSecondaryButton.color
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

const primaryButton = {
  ...base,
  ...primary
};
const secondaryButton = {
  ...base,
  ...secondary
};

export { base, small, smallRounded, primaryButton, secondaryButton }