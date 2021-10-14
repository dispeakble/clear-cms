
const styles = {
    container: {
        maxWidth: 1200,
        margin: "0 auto",
        padding: 15,
        display: "flex",
        flexDirection: "column",
        "& .image-gallery": {
            maxHeight: "400px"
        }
    },
    firstSection: {
      display: "flex",
    },
    secondSection: {
        display: "flex",
        "& > div": {
            margin: "0 10px"
        }
    },
    leftColumn: {
        width: "65%",
        position: "relative"
    },
    rightColumn: {
        width: "35%",
        marginTop: 20,
        marginLeft: 20
    },
    productDescription: {
        borderBottom: "1px solid #E1E8EE",
        marginBottom: 20,
        "& span": {
            fontSize: 12,
            letterSpacing: 1,
            textDecoration: "none"
        },
        "& h1": {
            fontWeight: 300,
            fontSize: 52,
            color: "#43484D",
            letterSpacing: -2
        },
        "& p": {
            fontSize: 16,
            fontWeight: 300,
            lineHeight: 24
        }
    },
    productConfiguration: {
        "& > div": {
            margin: "10px 0"
        }
    },
    productPrice: {
        display: "flex",
        alignItems: "center",
        "& span": {
            fontSize: 26,
            fontWeight: 300,
            color: "#43474D",
            marginRight: 20
        }
    },
    "@media (max-width: 940px)": {
        container: {
            flexDirection: "column",
            marginTop: 60,
            "& .image-gallery": {
                maxHeight: "none"
            }
        },
        leftColumn: {
            width: "100%",
            "& img": {
                width: 300,
                right: 0,
                top: -65,
                left: "initial"
            }
        },
        rightColumn: {
            width: "100%",
        }
    },
    "@media (max-width: 535px)": {
        leftColumn: {
            "& img": {
                width: 220,
                top: -85,
            }
        },
    }
};

export default  styles