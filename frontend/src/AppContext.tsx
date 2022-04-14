import React, {Component} from 'react'
import Locale from "./localize/Locale";

const AppContext = React.createContext({})

interface AppContextState {
    locale: Locale
}

export class ContextProvider extends Component {
    state: AppContextState = {
        locale: {
            lang: "en"
        }
    }

    setLocale = (locale: Locale) => {
        this.setState({locale: locale})
    }

    render() {
        return(
            <AppContext.Provider value={
                {
                    locale: this.state.locale,
                    setLocale: this.setLocale
                }
            }>
                {this.props.children}
            </AppContext.Provider>
        )
    }
}

export default AppContext