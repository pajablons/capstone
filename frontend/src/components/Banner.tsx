import React from "react";
import Locale from "../localize/Locale";

interface BannerProps {
    locale: Locale
    setLocaleFn: (newLoc: Locale) => void
}

interface BannerState {}

export default class Banner extends React.Component<BannerProps, BannerState> {
    private langData: any
    constructor(props: BannerProps) {
        super(props);
        this.langData = require('../localize/lang.json')
    }

    localeClick(evt: any) {
        this.props.setLocaleFn({
            lang: evt.target.value
        })
    }

    render() {
        return (
            <div className={"banner"}>
                <div className={"banner-heading"}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <img
                                        src={"https://osc.umd.edu/img/logos/26_logo.jpg"}
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "100px",
                                            display: "inline",
                                        }}
                                    />
                                </td>
                                <td>
                                    <h1>
                                        {this.langData['general']['page_title'][this.props.locale.lang]}
                                    </h1>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={"lang_select"}>
                    <button value={"en"} onClick={this.localeClick.bind(this)}>English</button>
                    <button value={"fr"} onClick={this.localeClick.bind(this)}>French</button>
                </div>
            </div>
        )
    }
}