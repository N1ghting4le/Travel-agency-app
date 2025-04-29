import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

const AccordionContainer = ({ children, titleEl }) => (
    <Accordion sx={{
        backgroundColor: "transparent",
        "&.Mui-expanded": {
            margin: 0,
        },
        "&.MuiAccordion-gutters::before": {
            display: "none"
        }
    }} style={{"--Paper-shadow": "none"}} defaultExpanded>
        <AccordionSummary 
            expandIcon={<ExpandMore />}
            sx={{
                "&.MuiAccordionSummary-root": {
                    padding: 0,
                    minHeight: 56,
                    height: 56
                },
                "& .MuiAccordionSummary-content": {
                    margin: 0
                }
            }}>
            {titleEl}
        </AccordionSummary>
        <AccordionDetails sx={{padding: 0, marginBottom: "10px"}}>
            {children}
        </AccordionDetails>
    </Accordion>
);

export default AccordionContainer;