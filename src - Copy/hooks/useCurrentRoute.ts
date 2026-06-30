import { useNavigationState, NavigationState, PartialState, Route } from '@react-navigation/native'

type NestedRouteNames = NavigationState | PartialState<NavigationState>

const getLastRouteName = (state: NestedRouteNames): string => {
    let route = state.routes[state.index] as Route<string> & {
        state?: NavigationState | PartialState<NavigationState>
    }
    let lastRouteName: string = route.name

    while (route.state && route.state.index !== undefined) {
        route = route.state.routes[route.state.index] as Route<string> & {
            state?: NavigationState | PartialState<NavigationState>
        }
        lastRouteName = route.name
    }

    return lastRouteName
}

const useCurrentRouteName = (): string => {
    const routeName = useNavigationState((state) => {
        return getLastRouteName(state as NestedRouteNames)
    })

    return routeName
}

export default useCurrentRouteName