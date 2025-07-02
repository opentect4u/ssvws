const FormField = ({
	id,
	name,
	label,
	type,
	placeholder,
	options,
	value,
	onChange,
	onBlur,
	error,
}) => (
	<div>
		<label
			htmlFor={id}
			className="block text-sm font-medium text-gray-700 mb-1"
		>
			{label}
		</label>
		{type === "select" ? (
			<select
				id={id}
				name={name}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				className="w-full px-4 py-2 bg-gray-100 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
			>
				<option value="" disabled>
					{placeholder}
				</option>
				{options.map((opt) => (
					<option key={opt.code} value={opt.code}>
						{opt.name}
					</option>
				))}
			</select>
		) : (
			<input
				id={id}
				name={name}
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				className="w-full px-4 py-2 bg-gray-100 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
			/>
		)}
		{error && <div className="text-red-500 text-sm mt-1">{error}</div>}
	</div>
)

export default FormField
