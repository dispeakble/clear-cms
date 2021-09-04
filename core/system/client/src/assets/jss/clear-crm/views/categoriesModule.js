const categoriesStyles = {
    backgroundView: {
        display: "flex",
        flexWrap: "wrap",
        "& > div": {
            margin: 5,
            padding: 10,
            width: 120,
            height: 120
        }
    },
    thumbnailView: {
        display: "flex",
        flexWrap: "wrap",
        "& > div": {
            margin: 5,
            padding: 10,
        }
    },
    cardContent: {
        padding: 0,
        display: "flex",
        "& > div": {
            marginLeft: 5
        }
    },
    thumbnailImg: {
        width: 120,
        height: 90
    }
};

export default categoriesStyles;
