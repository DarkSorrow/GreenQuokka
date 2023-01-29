import { MouseEvent, useState } from "react";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  DataGridProps
} from "@mui/x-data-grid";

import Sheet from '@mui/joy/Sheet';
import Button from '@mui/joy/Button';

type CreateButtonProps = {
  id: string;
  createTitle: string;
  noData: string;
  disableCreate: boolean;
  onClickCreate: (event: MouseEvent<HTMLButtonElement>) => void;
} & DataGridProps;

export const AppDataGrid = ({ id, createTitle, noData, disableCreate, onClickCreate, ...dataProps }: CreateButtonProps) => {
  const [pageSize, setPageSize] = useState<number>(10);

  return (
    <Sheet>
      <DataGrid
        autoHeight
        sx={{ border: 0 }}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 20, 50]}
        data-testid={`datagrid-${id}`}
        components={{
          Toolbar: () => (
            <GridToolbarContainer>
              {disableCreate && <Button data-id="new" onClick={onClickCreate} size="sm">{createTitle}</Button>}
              <GridToolbarColumnsButton />
              <GridToolbarFilterButton />
            </GridToolbarContainer>
          ),
        }}
        {...dataProps}
      />
    </Sheet>
  );
};
