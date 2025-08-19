import React from 'react'

const CustomSelect = ({
  id,
  name,
  label,
  formik,
  options,
  fullWidth = true,
}) => {
  const error = formik?.touched[name] && formik?.errors[name];
  return (
    <div className={`relative mb-2  w-full`}>
      <select
        id={id}
        name={name}
        className="w-full p-3 rounded-full focus:outline-none italic text-sm bg-[#818360] text-[#2F4B26]"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[name]}
      >
        <option value="" disabled>
          {label}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.question || option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default CustomSelect