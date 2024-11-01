import generateThemeColors from "../utils/generateThemeColors";

const getThemeColors = (baseColor: string = "rgb(107, 114, 128)") => {
    return generateThemeColors(baseColor);
};

export default getThemeColors;
