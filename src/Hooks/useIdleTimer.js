import { useEffect, useRef, useCallback, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { loadingContext } from "../Context/Democontext"
import { routePaths } from "../Assets/Data/Routes"

const useIdleTimer = (timeout = 20 * 60 * 1000) => {
	const { handleLogOut } = useContext(loadingContext)
	const navigate = useNavigate()
	const timerRef = useRef(null)

	const logout = useCallback(async () => {
		console.log('US CALL BACK')
		// Optionally, you can add more logout logic here (e.g., API calls)
		await handleLogOut().then(() => {
			navigate(routePaths.LANDING)
		})

		localStorage.clear()
	}, [navigate])

	const resetTimer = useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current)
		}
		timerRef.current = setTimeout(logout, timeout)
	}, [logout, timeout])

	useEffect(() => {
		const events = ["mousemove", "keydown", "scroll", "click"]

		events.forEach((event) => window.addEventListener(event, resetTimer))

		resetTimer()

		return () => {
			events.forEach((event) => window.removeEventListener(event, resetTimer))
			if (timerRef.current) {
				clearTimeout(timerRef.current)
			}
		}
	}, [resetTimer])

	return
}

export default useIdleTimer
