import React from "react";
import Locale from "../localize/Locale";
import ServerRequestStatus, {RequestState, RequestType} from "../ServerRequestState";
import AppContext from "../AppContext";

interface StatusDisplayProps {
    status: ServerRequestStatus
}

interface StatusDisplayState {
    loadingTime: number
}

export default class StatusDisplay extends React.Component<StatusDisplayProps, StatusDisplayState> {
    langData: any
    static contextType = AppContext
    constructor(props: StatusDisplayProps) {
        super(props)
        this.state = {
            loadingTime: 0
        }
        this.langData = require('../localize/lang.json')
    }

    render() {
        let msg = "";
        if (this.props.status.status === RequestState.READY) {
            msg = this.langData['general']['ready_state'][this.context.locale.lang]
        } else if (this.props.status.status === RequestState.LOADING) {
            switch(this.props.status.requestType) {
                case RequestType.INTERDICTING:      msg = this.langData['general']['loading_iz'][this.context.locale.lang];     break;
            }
            msg = msg + this.langData['general']['please_wait'][this.context.locale.lang]
        }
        return (
            <div>
                <p>
                    {msg}
                </p>
            </div>
        )
    }
}