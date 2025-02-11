import { Group, Pagination, Select } from "@mantine/core";
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { loader } from "~/routes/transactions._index";

const limitOptions = [
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

export default function PaginationTransaction() {
  const data = useLoaderData<typeof loader>();
  const limit = data.pagination.limit;
  const total = data.pagination.total;
  const totalPages = Math.ceil(total / limit);
  const offset = data.pagination.offset;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handlePageChange = (offset: number) => {
    searchParams.set("offset", ((offset - 1) * limit).toString());
    navigate(`?${searchParams.toString()}`);
  };

  const handleLimitChange = (limit: string | null) => {
    searchParams.set("limit", limit || "20");
    searchParams.set("offset", "0");
    navigate(`?${searchParams.toString()}`);
  };

  return (
    <Group justify="space-between">
      <Select
        w={100}
        value={String(limit)}
        onChange={handleLimitChange}
        data={limitOptions}
        allowDeselect={false}
      />
      <Pagination
        total={totalPages}
        value={offset / limit + 1}
        onChange={handlePageChange}
      />
    </Group>
  );
}
