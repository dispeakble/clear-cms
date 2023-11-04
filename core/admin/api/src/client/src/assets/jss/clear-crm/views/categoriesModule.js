const categoriesStyles = {
    description: {
        color: 'inherit',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    backgroundView: {
        display: "grid",
        gridGap: "10px",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        "& > div": {
            padding: 10,
            textShadow: '-1px -1px 1px rgba(255, 255, 255, 0.2), 1px 1px 1px rgba(0, 0, 0, 0.2)'
        },
        "& [class*='MuiCard']": {
            display: "flex !important",
            color: 'inherit',
            width: '100%',
            "& [class*='MuiCardContent']": {
                display: "flex !important",
                flex: 1,
                padding: 0,
                "& a": {
                    flex: 1,
                    "& h3": {
                        paddingTop: 0
                    }
                }
            }
        }
    },
    thumbnailView: {
        display: "flex",
        flexWrap: "wrap",
        "& > div": {
            margin: 5,
            padding: 10,
            textShadow: '-1px -1px 1px rgba(255, 255, 255, 0.2), 1px 1px 1px rgba(0, 0, 0, 0.2)'
        },
        "& [class*='MuiCard']": {
            display: "flex",
            color: 'inherit',
            width: '100%',
            "& [class*='MuiCardContent']": {
                display: "flex !important",
                flex: 1,
                padding: 0,
                "& a": {
                    display: "flex",
                    flex: 1
                }
            }
        }
    },
    cardWrapper: {
        padding: 0
    },
    thumbnailImg: {
        width: 120,
        height: 90
    },
    cardContent: {
        display: "flex"
    }
};

export default categoriesStyles;
