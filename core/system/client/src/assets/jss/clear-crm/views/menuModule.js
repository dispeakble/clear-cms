const javascriptStyles = {
    // for dropdown menu
    verticalLinksMenu: {
        display: "inline-block",
        "& > ul": {
            display: "inline-block",
            padding: 0,
            margin: 0,
            "& > li": {
                margin: 0,
                display: "block",
                position: "relative",
                left: 0,
                background: "#525789",
            },
        },
        "& > ul ul": {},
        "& ul": {
            display: "inline-block",
            margin: 0,
            padding: 0,
            listStyle: "none",
            "& li": {
                margin: 0,
                display: "block",
                position: "relative",
                background: "#525789",
                "& ul": {display: "none", margin: 0},
                "& a": {
                    margin: 0,
                    display: "block",
                    padding: "1em",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    color: "#fff",
                    transition: "0.3s",
                    "&:hover": {
                        background: "rgba(255,255,255,0.1) !important",
                    },
                },
                "&:hover": {
                    cursor: "pointer",
                    "& > ul": {
                        display: "block",
                        position: "absolute",
                        opacity: 0.9,
                        left: "100%",
                        top: 0,
                    },
                    "& li": {},
                    "& a": {
                        background: "#41424c",
                    },
                },
            },
            "&:before": {
                content: " ",
                display: "table",
            },

            "&:after": {
                content: " ",
                display: "table",
                clear: "both",
            },
        },
    },
    horizontalLinksMenu: {
        display: "inline-block",
        "& ul": {
            margin: 0,
            padding: 0,
            listStyle: "none",
            "& li": {
                flex: 1,
                display: "inline-block",
                "& ul": {display: "none"},
                "& a": {
                    display: "flex",
                    padding: "0.4em 1em",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    transition: "0.3s",
                    height: "100%",
                    "&:hover": {
                        background: "#8497AF",
                    },
                },
                "&:hover": {
                    cursor: "pointer",
                    "& > ul": {
                        flex: 1,
                        display: "inline-block",
                        position: "absolute",
                        opacity: 0.9,
                    }
                },
            },
            "&:before": {
                content: " ",
                display: "table",
            },

            "&:after": {
                content: " ",
                display: "table",
                clear: "both",
            },
            "& ul": {
                "& ul": {
                    left: "100%",
                    top: "0",
                },
            },
        },
    },
};

export default javascriptStyles;
