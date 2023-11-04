import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/clear-crm/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  const { whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const date = new Date()
  const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' })
  const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat .formatToParts(date )
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a
                href="//crm-awesome.io"
                className={classes.block}
                target="_blank"
                rel="noreferrer"
              >
                Contact us
              </a>
            </ListItem>
          </List>
        </div>
        <div className={classes.right}>
          {day}/{month}/{year}
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  whiteFont: PropTypes.bool
};
