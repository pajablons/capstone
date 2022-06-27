import React from "react";
import AppContext from "../AppContext";
import API_Engine from "../api/API_Engine";

interface BannerProps {
}

interface BannerState {}

export default class Banner extends React.Component<BannerProps, BannerState> {
    langData: any
    static contextType = AppContext
    constructor(props: BannerProps) {
        super(props);
        this.langData = require('../localize/lang.json')
    }

    localeClick(evt: any) {
        this.context.setLocale({
            lang: evt.target.value
        })
    }

    resetLaydown(evt: any) {
        API_Engine.deleteAll().then(() => {

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
                                        onClick={this.resetLaydown.bind(this)}
                                        src={"uber-logo.png"}
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "32px",
                                            display: "inline",
                                        }}
                                    />
                                </td>
                                <td>
                                    <h1>
                                        {this.langData['general']['page_title'][this.context.locale.lang]}
                                    </h1>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={"profile-select"}>
                </div>
                <div className={"lang_select"}>
                    <button value={"en"} onClick={this.localeClick.bind(this)}>English</button>
                    <button value={"fr"} onClick={this.localeClick.bind(this)}>French</button>
                </div>
            </div>
        )
    }
}