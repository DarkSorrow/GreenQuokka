import { useState, useEffect, MouseEvent } from 'react';
import { useTranslation, Trans } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from "react-router-dom";
import {
  GridActionsCellItem,
  GridRowParams,
  GridEnrichedColDef,
  GridColumnHeaderParams,
} from "@mui/x-data-grid";
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';

import { AppSchemasTemplate } from "../templates/app-schemas";
import { SelectTopicList, TopicList } from '../molecules/select-topic-list';
import { AppDataGrid } from '../molecules/app-datagrid';
import { AppDialogConfirm } from '../organisms/app-dialog-confirm';
import { Openi18nOption, Template } from '../../types/Schemas';
import { useAuth } from '../../providers/auth';
import { LoadingSuspense } from '../atoms/loading-suspense';

interface DataLoad {
  loading: boolean;
  data: Array<Template>;
}

export const AppSchemasPage = () => {
  const { t } = useTranslation();
  const { userToken, exp } = useAuth();
  const navigate = useNavigate();
  const [value, setValue] = useState<TopicList | null>(null);
  const [data, setData] = useState<DataLoad>({
    loading: true,
    data: [],
  });
  const [cfDel, setCfDel] = useState<Openi18nOption>({
    open: false,
    i18nMessage: '',
  });
  const openClient = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.currentTarget.dataset && event.currentTarget.dataset['id'] && value) {
      navigate(`/schemas/topic/${value.topics}/${event.currentTarget.dataset['id']}`)
    }
  }

  //navigator.clipboard.writeText('Copy this text to clipboard')
  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch(`/api/v1/templates/${value?.topics}`, {
          method: 'GET',
          headers: {
            "X-Quokka-Token": userToken ?? '',
          }
        });
        const resp = await response.json();
        if (response.status === 200) {
          setData({
            loading: false,
            data: resp.data.map((data: Template) => ({
              ...data,
              id: `${data.subject}-${data.version}-${data.topic}`,
              link: `${window.location.origin}/forms/${userToken}/${data.topic}/${data.subject}/${data.version}`
            })),
          });
        } else {
          console.log(response.status);
          setData({
            loading: false,
            data: [],
          });
        }
      } catch (err)  {
        console.log(err);
        setData({
          loading: false,
          data: [],
        });
      }  
    }
    if (value !== null && value.topics) {
      init();
    }
  }, [value?.topics, userToken]);

  const handleClose = () => {
    setCfDel({
      ...cfDel,
      open: false,
    });
  }
  const handleDelete = async () => {
    if (userToken && exp && cfDel.i18nObject?.id) {
      //await deleteRecord(`/api/v1/supplier/${cfDel.i18nObject?.id}`, exp, userToken);
    }
    setCfDel({
      ...cfDel,
      open: false,
    });
    //setURL(`${URL}?reload=${new Date().toUTCString()}`);
  }
  const renderRowActions = (params: GridRowParams) => [
    <GridActionsCellItem
      icon={<DeleteIcon color="error" />}
      onClick={() => {
        setCfDel({
          open: true,
          i18nMessage: 'cfDel',
          i18nObject: {
            name: params.row.subject,
            id: params.id,
          }
        });
      }}
      data-id={params.id}
      label="delete-row"
    />,
    <GridActionsCellItem
      icon={<EditIcon color="primary" />}
      onClick={openClient}
      data-id={params.id}
      label="edit-row"
    />,
    <GridActionsCellItem
      icon={<ContentCopyIcon color="info" />}
      onClick={() => navigator.clipboard.writeText(params.row.link)}
      label="edit-row"
    />,
  ];

  const columnsDef: GridEnrichedColDef[] = [
    {
      field: "subject",
      headerName: t<string>("pschema.subject"),
      description: t<string>("pschema.subject"),
      editable: false,
      flex: 1,
    },
    {
      field: "link",
      headerName: t<string>("pschema.link"),
      description: t<string>("pschema.linkDesc"),
      editable: false,
      flex: 1,
    },
    {
      field: "version",
      headerName: t<string>("pschema.version"),
      description: t<string>("pschema.version"),
      editable: false,
      flex: 1,
    },
    {
      field: "format",
      headerName: t<string>("pschema.format"),
      description: t<string>("pschema.format"),
      editable: false,
      flex: 1,
    },
    {
      field: "updatedAt",
      headerName: t<string>("pschema.update"),
      description: t<string>("pschema.update"),
      editable: false,
      flex: 1,
    },
    {
      field: "actions",
      renderHeader: (params: GridColumnHeaderParams) => <div></div>,
      type: "actions",
      getActions: renderRowActions,
      flex: 0.8,
    },
  ];

  if (data.loading) {
    <LoadingSuspense />
  }
  return (
    <AppSchemasTemplate
      topicsManagement={
      <Card
        variant="outlined"
        row
        sx={{
          width: '100%',
          gap: 2,
        }}
      >
        <div>
          <Typography level="h2" fontSize="lg" id="card-description" mb={0.5}>
            {t<string>('pschema.title')}
          </Typography>
          <Typography fontSize="sm" aria-describedby="card-description" mb={1} sx={{ color: 'text.tertiary' }}>
            {t<string>('pschema.desc')}
          </Typography>
          <SelectTopicList value={value} setValue={setValue} />
        </div>
      </Card>}
      topicList={
      <>
        <AppDataGrid
          id="topic-grid" 
          createTitle={t<string>('pschema.addschema')}
          noData={t<string>('noData')}
          onClickCreate={openClient}
          columns={columnsDef}
          disableCreate={value !== null}
          rows={data.data}
          checkboxSelection
        />  
        <AppDialogConfirm
          id="schemas"
          title={t<string>('remove')}
          open={cfDel.open}
          onClose={handleClose}
          onConfirm={handleDelete}
        >
          <Trans i18nKey={cfDel.i18nMessage} values={cfDel.i18nObject} />
        </AppDialogConfirm>
      </>
        }
    />
  );
}
