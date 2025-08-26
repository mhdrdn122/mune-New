const RefreshButton = ({handleClick}) => {
  return (
    <button className="rounded border bg-light mb-5 p-1" onClick={handleClick}>
      إعادة المحاولة
    </button>
  );
};

export default RefreshButton;
