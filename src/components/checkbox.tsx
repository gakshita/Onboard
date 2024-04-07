interface CheckboxProps {
  onClick: () => void;
  checked: boolean;
}
const Checkbox: React.FC<CheckboxProps> = ({ onClick, checked }) => {
  return (
    <div className="inline-flex items-center ">
      <label
        className="relative mr-3 flex cursor-pointer items-center rounded-full"
        htmlFor="checkbox"
      >
        <input
          type="checkbox"
          className="before:content[''] border-blue-gray-200 before:bg-blue-gray-500 peer relative h-5 h-[24px] w-5 w-[24px] cursor-pointer appearance-none rounded-md border transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
          id="checkbox"
          checked={checked}
          onChange={onClick}
        />
        <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            stroke="currentColor"
            stroke-width="1"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </span>
      </label>
    </div>
  );
};

export default Checkbox;
