const categoriesStyles = {
    description: {
        color: 'inherit',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    backgroundView: {
        display: "flex",
        flexWrap: "wrap",
        "& > div": {
            margin: 5,
            padding: 10,
            textShadow: '-1px -1px 1px rgba(255, 255, 255, 0.2), 1px 1px 1px rgba(0, 0, 0, 0.2)'
        }
    },
    thumbnailView: {
        display: "flex",
        flexWrap: "wrap",
        "& > div": {
            margin: 5,
            padding: 10,
            textShadow: '-1px -1px 1px rgba(255, 255, 255, 0.2), 1px 1px 1px rgba(0, 0, 0, 0.2)'
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
