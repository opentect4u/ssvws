import React from "react"
function TDInputTemplateCr(props) {
	return (
		<>
			<label
				htmlFor={props.name}
				className="block mb-2 text-sm capitalize font-bold text-teal-700 dark:text-gray-100"
			>
				{/* <div className="relative">
    <input type="text" id="floating_outlined" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
    <label for="floating_outlined" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Floating outlined</label>
</div> */}{" "}
				{props.mode !== 3
					? props.label
					: props.label + " (" + props.formControlName?.length + "/500)"}
			</label>
			{props.mode == 1 && (
				<input
					type={props.type}
					id={props.name}
					name={props.name}
					value={props.formControlName}
					multiple={props.multiple}
					min={props.min}
					accept={props.accept}
					max={props.max}
					className="bg-white border-gray-400 text-gray-800 text-sm rounded-md  focus:border-teal-800 active:border-teal-600 focus:ring-teal-600 focus:border-1 duration-500 block w-full p-2 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					placeholder={props.placeholder}
					onChange={props.handleChange}
					onBlur={props.handleBlur}
					disabled={props.disabled}
				/>
			)}
			{props.mode == 2 && (
				// <Select
				//   showSearch
				//   className="bg-slate-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 "
				//   name={props.name}
				//   value={props.formControlName}
				//   placeholder={props.placeholder}
				//   onChange={(value,key) => {console.log(value,key);props.handleChange({ target: { name: props.name,value } })}}
				//   onBlur={() => props.handleBlur({ target: { name: props.name } })}
				//   optionFilterProp="label"
				//   size={"large"}
				//   options={props.data}
				// />
				// <Dropdown
				// className="bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:border-red-800 active:border-red-800 focus:ring-green-900 focus:border-1 duration-300 block w-full p-1.5 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
				// filter
				// value={props.formControlName}
				// onChange={props.handleChange}
				// name={props.name}
				// placeholder={props.placeholder}
				// options={props?.data}
				// optionLabel="name"
				// onBlur={props.handleBlur}
				// />
				<select
					id="countries"
					className="bg-white border-1 border-gray-400 text-gray-800 text-sm rounded-lg focus:border-teal-800 active:border-teal-600 focus:ring-teal-600 focus:border-1 duration-500 block w-full p-2 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					value={props.formControlName}
					onChange={props.handleChange}
					name={props.name}
					placeholder={props.placeholder}
					options={props?.data}
					onBlur={props.handleBlur}
					disabled={props.disabled}
				>
					<option defaultValue={undefined}>{props.placeholder}</option>
					{props?.data?.map((item, index) => (
						<option key={index} value={item.code}>
							{item.name}
						</option>
					))}
				</select>
			)}
			{props.mode == 3 && (
				<textarea
					rows="4"
					className="bg-white border-1 border-gray-400 text-sm rounded-lg  focus:border-teal-800 active:border-teal-600 focus:ring-teal-600 focus:border-1 duration-500 block w-full p-2 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					name={props.name}
					value={props.formControlName}
					placeholder={props.placeholder}
					onChange={props.handleChange}
					onBlur={props.handleBlur}
					disabled={props.disabled}
					maxLength={500}
				/>
			)}
		</>
	)
}

export default TDInputTemplateCr
