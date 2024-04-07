import { useState } from "react";
import { useAuth } from "~/context";
import { api } from "~/utils/api";

const PAGE_LIMIT = 6;

const useInerests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [errMessage, setErrMessage] = useState(null);
  const [loading, setLoading] = useState<Number | null>(null);
  const {
    authState: { userId },
  } = useAuth();
  console.log({ userId });
  const categories =
    userId &&
    api &&
    api.category.all.useQuery({
      limit: PAGE_LIMIT,
      skip: currentPage * PAGE_LIMIT,
      userId: userId.toString(),
    });

  const { mutateAsync, error } = api.user.addCategory.useMutation({
    onError: (err: any) => {
      setErrMessage(err), console.log(err);
    },
  });

  const handleCheckboxChange = async (id: number) => {
    console.log(id, userId);
    setLoading(id);

    try {
      const res = await mutateAsync({
        userId: userId.toString(),
        categoryId: id.toString(),
      });
      console.log(res);
      await categories.refetch();
      console.log(categories);
    } catch (err) {
      console.log(err);
    }
    setLoading(null);
  };

  return {
    categories,
    handleCheckboxChange,
    currentPage,
    setCurrentPage,
    loading,
  };
};

export default useInerests;
