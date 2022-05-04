import React from "react";
import {Collapse, IconButton, TableCell} from "@mui/material";
import {
    KeyboardArrowDownRounded,
    KeyboardArrowDownSharp,
    KeyboardArrowUpRounded,
    KeyboardArrowUpSharp
} from "@mui/icons-material";
import BufferTrigger from "./BufferTrigger";

interface CollapseTableProps {
    name: string
    type: string
}

interface CollapseTableState {
    open: boolean
}

export default class CollapseTable extends React.Component<CollapseTableProps, CollapseTableState> {
    constructor(props: CollapseTableProps) {
        super(props);
        this.state = {
            open: false,
        }
    }

    toggleOpen() {
        this.setState({open: !this.state.open})
    }

    render() {
        return (
            <React.Fragment>
                <tr>
                    <td>
                        <IconButton
                            style={{width: "fit-content"}}
                            size={"small"}
                            onClick={this.toggleOpen.bind(this)}
                        >
                            {this.state.open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
                        </IconButton>
                    </td>
                    <td>
                        {this.props.name}
                    </td>
                    <td>{this.props.type === 'point' ? <BufferTrigger collectionName={this.props.name}/> : ''}</td>
                </tr>
                <tr>
                    <TableCell colSpan={4}>
                        <Collapse in={this.state.open}>
                            {this.props.children}
                        </Collapse>
                    </TableCell>
                </tr>
            </React.Fragment>
        )
    }
}