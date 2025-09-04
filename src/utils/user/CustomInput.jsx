import React from "react";
import useGetStyle from "../../hooks/useGetStyle";

const CustomInput = ({
  id,
  name,
  label,
  type = "text",
  formik,
  iconLeft = null,
  iconRight = null,
  placeholder = null,
  className = "",
  fullWidth = true,
}) => {
  console.log(name)
  const error = formik?.touched?.[name] && formik?.errors?.[name];
  const {Color} = useGetStyle();
  const [showPassword, setShowPassword] = React.useState(false);
 
  const containerClasses = `relative ${fullWidth ? "w-full" : "w-auto"}`;

  const inputClasses = `
    w-full 
    pl-10 
    ${iconRight ? "pr-10" : "pr-3"} 
    py-3 
    rounded-full 
    focus:outline-none 
    focus:ring-2 
    focus:ring-[#2F4B26]/50 
    italic 
    text-base 
    bg-[#818360] 
    text-[#2F4B26] 
    placeholder-[#2F4B26]/70 
    transition-all 
    duration-200 
    ${error ? "border border-red-500" : "border border-transparent"} 
    ${className}
  `;

   const iconClasses =
    `absolute top-1/2 -translate-y-1/2 text-[#${Color}] text-lg`;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-2 w-full">
      <div className={containerClasses}>
        {iconLeft &&
          React.cloneElement(iconLeft, {
            className: `${iconClasses} left-4 `,
          })}

        <input
          id={id}
          name={name}
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder || label}
          style={{
            outline: `1px solid #${Color}`,
          }}
          className={inputClasses}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />

        {iconRight &&
          React.cloneElement(iconRight, {
            className: `${iconClasses} right-4  cursor-pointer`,
            onClick: type === "password" ? handleTogglePassword : undefined,
          })}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="text-red-500 text-sm mt-1 ml-4 font-medium"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomInput;