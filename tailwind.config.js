/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/flowbite/**/*.js"],
	darkMode: "class",
	theme: {
		extend: {
			backgroundImage: {
				hello: "url('Assets/Images/hello.png')",
				hellooffice: "url('Assets/Images/hellooffice.png')",
				hero_pattern: "url('Assets/Images/colored_shapes.svg')",
				hero_pattern2: "url('Assets/Images/Sprinkle.svg')",
				hero_anim: "url('Assets/Images/Animated_Shape_Blue.svg')",
				hero_anim_pink: "url('Assets/Images/Animated_Shape_Pink.svg')",
				hero_anim_purple: "url('Assets/Images/Animated_Shape_Purple.svg')",
				hero_anim_green: "url('Assets/Images/Animated_Shape_Green.svg')",
			},
			backgroundColor: {
				emerald: {
					50: "#e8fcf9",
					100: "#d1faf4",
					200: "#14b89f",
					300: "#12a18b",
					400: "#3eb67e",
					500: "#347865",
					600: "#0a5c50",
					700: "#08453c",
					800: "#052d27",
					900: "#031714",
				},
			},
			colors: {
				emerald: {
					50: "#e8fcf9",
					100: "#d1faf4",
					200: "#14b89f",
					300: "#12a18b",
					400: "#3eb67e",
					500: "#347865",
					600: "#0a5c50",
					700: "#08453c",
					800: "#052d27",
					900: "#031714",
				},
			},
		},
	},
	plugins: [
		require("flowbite/plugin")({
			charts: true,
		}),
	],
}
