export default function SortButton({ onClick, disabled }) {
  const buttonBg = disabled
    ? "bg-slate-200"
    : "bg-gradient-to-r from-indigo-500 to-pink-500";

  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        type="button"
        className={`${buttonBg} rounded-lg p-2 text-slate-50 drop-shadow-lg transition duration-500 ease-in-out ${
          disabled || "hover:scale-110"
        }`}
        disabled={disabled}
      >
        Sort
      </button>
    </div>
  );
}
