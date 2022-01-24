const javascriptStyles = {
    PositionerHolder: {
        display: "grid",
        gridGap: "0",
        gridTemplateColumns:"repeat(3, 1fr)",
        "& > button": {
            border: "1px solid rgba(0,0,0,0.3)",
            minWidth: 30,
            minHeight: 30,
            cursor: "pointer",
            whiteSpace: "nowrap",
            "&.selected": {
                background: "rgba(0,0,0,0.3)",
                color: "white"
            }
        },
        "& *:nth-child(1)": {
            borderRadius: "5px 0 0"
        },
        "& *:nth-child(3)": {
            borderRadius: "0 5px 0 0"
        },
        "& *:nth-child(7)": {
            borderRadius: "0 0 0 5px"
        },
        "& *:nth-child(9)": {
            borderRadius: "0 0 5px "
        }
    }
}

export default javascriptStyles;