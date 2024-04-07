import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "~/context";
import { api } from "~/utils/api";

const PAGE_LIMIT = 6;

export interface CategoryInterface {
  data: {
    data: {
      id: number;
      name: string;
      isInterested: boolean;
    }[];
  };
  refetch: () => void;
}

const useInerests = () => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [errMessage, setErrMessage] = useState(null);
  const [loading, setLoading] = useState<number | null>(null);
  const {
    authState: { userId },
  } = useAuth();
  // const userId = router.query.userId;
  console.log({ userId });
  const categories =
    userId &&
    api &&
    api.category.all.useQuery({
      limit: PAGE_LIMIT,
      skip: currentPage * PAGE_LIMIT,
      userId: userId?.toString(),
    });

  const { mutateAsync } = api.user.addCategory.useMutation({
    onError: (err: any) => {
      setErrMessage(err), console.log(err);
    },
  });

  const handleCheckboxChange = async (id: number) => {
    console.log(id, userId);
    setLoading(id);
    if (!userId) return;
    try {
      const res = await mutateAsync({
        userId: userId?.toString(),
        categoryId: id.toString(),
      });
      console.log(res);
      await (categories as CategoryInterface).refetch();
      console.log(categories);
    } catch (err) {
      console.log(err);
    }
    setLoading(null);
  };

  useEffect(() => {
    console.log("categories", categories, userId, router);
    if (categories) {
      categories.refetch();
    }
  }, [router.isReady]);
  return {
    categories,
    handleCheckboxChange,
    currentPage,
    setCurrentPage,
    loading,
    errMessage,
  };
};

export default useInerests;
