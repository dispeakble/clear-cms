import React, {Component} from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ReactHtmlParser from 'react-html-parser';

class AccordionModule extends Component {
  state = {
    expanded: "",
    sections: [],
  };

  componentDidMount() {
    let res = [];
    for (let i = 0; i < 10; i++) {
      res.push({id: i, title: `Section ${i}`, content: "some content"});
    }
    this.setState({
      sections: res,
    });
  }

  handleChange(id) {
    this.setState({
      expanded: id,
    });
  }

  render() {
    return (
        <React.Fragment>
          {this.props.element.moduleOptions.sections.map((section, idx) => {
            const id = `panel${idx}a-content`;
            return (
                <Accordion
                    key={idx}
                    expanded={this.state.expanded === id}
                    onChange={() => this.handleChange(id)}
                >
                  <AccordionSummary
                      expandIcon={<ExpandMoreIcon/>}
                      aria-controls={id}
                  >
                    <Typography title={section.title}>{section.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>{ReactHtmlParser(section.content)}</AccordionDetails>
                </Accordion>
            );
          })}
        </React.Fragment>
    );
  }
}

export default AccordionModule;
