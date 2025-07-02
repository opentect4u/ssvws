import React, { useEffect, useCallback } from "react"

// Custom hook for Ctrl+P / Cmd+P shortcut
export function useCtrlP(callback) {
	const handler = useCallback(
		(event) => {
			if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "p") {
				event.preventDefault()
				callback(event)
			}
		},
		[callback]
	)

	useEffect(() => {
		window.addEventListener("keydown", handler)
		return () => window.removeEventListener("keydown", handler)
	}, [handler])
}
