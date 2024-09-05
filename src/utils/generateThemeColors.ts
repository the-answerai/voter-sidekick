import tinycolor from "tinycolor2";

function generateThemeColors(baseColor: string) {
  const base = tinycolor(baseColor);

  const getContrastingColor = (color: tinycolor.Instance) => {
    return color.isLight()
      ? tinycolor("black").toHexString()
      : tinycolor("white").toHexString();
  };

  return {
    buttonBackgroundColor: base.setAlpha(0.5).toRgbString(), // Changed to 50% opacity
    buttonIconColor: getContrastingColor(base),
    chatWindowBackgroundColor: base.lighten(20).toHexString(),
    chatWindowPoweredByTextColor: getContrastingColor(base.lighten(20)),
    botMessageBackgroundColor: base.lighten(10).toHexString(),
    botMessageTextColor: getContrastingColor(base.lighten(10)),
    userMessageBackgroundColor: base.toHexString(),
    userMessageTextColor: getContrastingColor(base),
    textInputSendButtonColor: base.toHexString(),
    feedbackColor: base.toHexString(),
    textInputBackgroundColor: "#ffffff",
    textInputTextColor: "#000000",
    footerTextColor: "#000000",
  };
}

export default generateThemeColors;
