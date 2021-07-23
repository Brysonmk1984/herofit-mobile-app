import { primaryButton as cPrimaryButton, secondaryButton as cSecondaryButton, pressedButton as cPressedButton, linkText, lightLinkText } from "./colors";

const base = {
  paddingHorizontal: 10,
  paddingVertical: 12,
};
const baseSmall = {
  paddingHorizontal: 8,
  paddingVertical: 8,
};
const primary = {
  backgroundColor : cPrimaryButton.backgroundColor,
  color : cPrimaryButton.color
};
const secondary = {
  backgroundColor : cSecondaryButton.backgroundColor,
  color : cSecondaryButton.color
};
const pressed = {
  backgroundColor : cPressedButton.backgroundColor,
  color : cPressedButton.color
};

const textLink = {
  color: linkText.color,
  textDecorationLine: 'underline'
}

const lightTextLink = {
  color: lightLinkText.color,
  textDecorationLine: 'underline'
}

const rounded = {
  borderRadius: 12
};

const alertButton = {
  ...baseSmall,
  ...rounded,
  ...secondary
};

const alertButtonPressed = {
  ...baseSmall,
  ...rounded,
  ...pressed
};

const primaryButton = {
  ...base,
  ...primary
};
const secondaryButton = {
  ...base,
  ...secondary
};
const pressedButton = {
  ...base,
  ...pressed
};

export { base, primaryButton, secondaryButton, pressedButton, alertButton, alertButtonPressed, textLink, lightTextLink }