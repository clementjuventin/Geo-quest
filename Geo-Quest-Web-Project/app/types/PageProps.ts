export type BaseProps = {
    navigation: NavigationType,
    route?: {
        params?: any
    }
}

export type NavigationType =
    {
        navigate: (route: string, params?: any) => void,
        goBack: () => void,
        push: (route: string, params?: any) => void,
    }

export enum Pages {
    Login = "Login",
    SignUp = "SignUp",
    Home = "Home",
    Navigation = "Navigation",
    Map = "Map",
    CreateQuest = "CreateQuest",
    EditLocation = "EditLocation",
    ViewLocations = "ViewLocations",
    AddCode = "AddCode",
    Scan = "Scan",
} 