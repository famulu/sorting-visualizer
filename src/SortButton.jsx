export default function SortButton({onClick, inProgress}) {
    const buttonBg = inProgress ? "bg-slate-200" : "bg-gradient-to-r from-indigo-500 to-pink-500";

    return <div className="flex justify-center">
        <button
            onClick={onClick}
            type="button"
            className={`${buttonBg} text-slate-50 p-2 rounded-lg drop-shadow-lg transition ease-in-out duration-500 ${inProgress || 'hover:scale-110'}`}
            disabled={inProgress}
        >
            Sort
        </button>
    </div>;
}
