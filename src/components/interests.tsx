import { useEffect } from "react";
import Checkbox from "~/components/checkbox";
import useInerests, { CategoryInterface } from "~/hooks/useInterests";

const TOTAL_PAGES = 169;

interface CategoryType {
  id: number;
  name: string;
  isInterested: boolean;
}

const Interests = () => {
  const {
    categories,
    handleCheckboxChange,
    currentPage,
    setCurrentPage,
    loading,
  } = useInerests();
  useEffect(() => {
    console.log("categories", categories);
    if (categories) {
      categories.refetch();
    }
  }, []);
  return (
    <div className="m-auto flex">
      <div className="border-light_grey m-auto w-[576px] rounded-[20px] border-[1px] px-12 py-10 ">
        <h1 className="text-xxxl mb-6 text-center font-semibold">
          Please mark your interests!{" "}
        </h1>
        <div className="flex h-[500px] flex-col">
          <div className="text-md mb-7 text-center">
            We will keep you notified.{" "}
          </div>{" "}
          <div className="text-md mb-7 text-xl font-medium">
            My saved interests!{" "}
          </div>{" "}
          <div className="flex-1">
            {categories && (categories as CategoryInterface).data ? (
              (categories as CategoryInterface).data?.data.map(
                (category: CategoryType) => (
                  <div className="mb-5  flex" key={category.id}>
                    {loading !== category.id ? (
                      <Checkbox
                        onClick={() =>
                          !category.isInterested &&
                          handleCheckboxChange(category.id)
                        }
                        checked={category.isInterested}
                      />
                    ) : (
                      <span className="loader mr-3"></span>
                    )}
                    <label className="text-md my-auto capitalize">
                      {category.name}
                    </label>
                  </div>
                ),
              )
            ) : (
              <div>Loading...</div>
            )}
          </div>
          <div className="text-grey2 mt-20 flex gap-3 text-xl font-medium">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              {"<<"}
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((state) => (state > 1 ? state - 1 : state))
              }
            >
              {"<"}
            </button>
            {Array.from({
              length:
                TOTAL_PAGES - currentPage > 5 ? 5 : TOTAL_PAGES - currentPage,
            }).map((_, i) => (
              <button
                className={`${i == 0 && "text-black"}`}
                key={i}
                onClick={() => setCurrentPage(currentPage + i)}
              >
                {currentPage + i}
              </button>
            ))}
            ...
            <button
              disabled={currentPage === TOTAL_PAGES}
              onClick={() =>
                setCurrentPage((state) =>
                  state === TOTAL_PAGES ? state : state + 1,
                )
              }
            >
              {">"}
            </button>
            <button
              onClick={() => setCurrentPage(TOTAL_PAGES)}
              disabled={currentPage === TOTAL_PAGES}
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Interests;
