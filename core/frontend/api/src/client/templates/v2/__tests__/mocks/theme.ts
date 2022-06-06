import { getIcon } from "../../helpers/icons";

const getIcons = (iconName: string) => {
    return getIcon(iconName);
};

const myMockTheme: Record<string, any> = {
    colors: {
        "primaryColor": { "label": "Primary Color", "value": "#DC6B03" },
        "primaryColorRBG": { "label": "Primary Color RBG", "value": { "r": 220, "g": 107, "b": 3 } },
        "primaryColorFadedRBG": { "label": "Primary Color Faded RBG", "value": { "r": 252, "g": 232, "b": 221 } },
        "primaryDark": { "label": "Primary Dark", "value": "orange" },
        "primaryLight": { "label": "Primary Light", "value": "#FF9F5A" },
        "primaryColorHover": { "label": "Primary Color Hover", "value": "#FC8C25" },
        "primaryRed": { "label": "Primary Red", "value": "#DC0303" },
        "secondaryColor": { "label": "Secondary Color", "value": "#FF0000" },
        "accentColor": { "label": "Accent Color", "value": "#f39200" },
        "darkRed": { "label": "Dark Red", "value": "#E90000" },
        "jetBlack": { "label": "Jet Black", "value": "#333" },
        "black": { "label": "Black", "value": "#000" },
        "offWhite": { "label": "Off White", "value": "#f5f5f5" },
        "white": { "label": "White", "value": "#fff" },
        "gray": { "label": "Gray", "value": "#505050" },
        "mainBackground": { "label": "Main Background", "value": "#E5E5E5" },
        "footerLinks": { "label": "Footer Links", "value": "#868484" },
        "greyBorder": { "label": "Grey Border", "value": "#ACACAC" },
        "borderOutline": { "label": "Border Outline", "value": "#DBDBDB" }
    }, icon: getIcons
};

export {
    myMockTheme
};