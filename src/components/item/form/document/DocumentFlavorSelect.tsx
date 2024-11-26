import { Controller, useFormContext } from 'react-hook-form';

import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  SxProps,
  Typography,
  lighten,
  useTheme,
} from '@mui/material';

import { DocumentItemExtraFlavor } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { FLAVOR_SELECT_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

const getIcon = (flavor: `${DocumentItemExtraFlavor}`) => {
  switch (flavor) {
    case DocumentItemExtraFlavor.Info:
      return <InfoOutlinedIcon fontSize="small" color="info" />;
    case DocumentItemExtraFlavor.Success:
      return (
        <CheckCircleOutlineOutlinedIcon fontSize="small" color="success" />
      );
    case DocumentItemExtraFlavor.Warning:
      return <ReportProblemOutlinedIcon fontSize="small" color="warning" />;
    case DocumentItemExtraFlavor.Error:
      return <ErrorOutlineOutlinedIcon fontSize="small" color="error" />;
    default:
      return null;
  }
};

const DocumentFlavorListElement = ({
  sx,
  flavor,
  name,
}: {
  flavor: `${DocumentItemExtraFlavor}`;
  name: string;
  sx?: SxProps;
}) => (
  <Stack direction="row" alignItems="center" height="100%" spacing={1} sx={sx}>
    {getIcon(flavor)}
    <Typography>{name}</Typography>
  </Stack>
);

export const DocumentFlavorSelect = (): JSX.Element => {
  const { control, register } = useFormContext<{
    flavor: `${DocumentItemExtraFlavor}`;
  }>();
  const { t } = useBuilderTranslation();
  const theme = useTheme();
  const flavorsTranslations = Object.values(DocumentItemExtraFlavor).map(
    (f) => [
      f,
      t(
        BUILDER[
          `DOCUMENT_FLAVOR_${
            f.toUpperCase() as Uppercase<`${DocumentItemExtraFlavor}`>
          }`
        ],
      ),
    ],
  ) as [DocumentItemExtraFlavor, string][];

  const getFlavorColor = (f: `${DocumentItemExtraFlavor}`) => {
    switch (f) {
      case DocumentItemExtraFlavor.Info:
        return lighten(theme.palette.info.light, 0.9);
      case DocumentItemExtraFlavor.Error:
        return lighten(theme.palette.error.light, 0.9);
      case DocumentItemExtraFlavor.Success:
        return lighten(theme.palette.success.light, 0.9);
      case DocumentItemExtraFlavor.Warning:
        return lighten(theme.palette.warning.light, 0.9);
      default:
        return 'transparent';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl variant="standard" sx={{ width: '100%', my: 1 }}>
        <InputLabel shrink id={FLAVOR_SELECT_ID}>
          {t(BUILDER.DOCUMENT_FLAVOR_SELECT_LABEL)}
        </InputLabel>
        <Controller
          name="flavor"
          control={control}
          render={({ field }) => (
            <Select
              id={FLAVOR_SELECT_ID}
              variant="standard"
              label="flavor"
              value={field.value}
              {...register('flavor')}
              renderValue={() => (
                <DocumentFlavorListElement
                  sx={{
                    borderRadius: 2,
                    backgroundColor: getFlavorColor(field.value),
                    p: 1,
                  }}
                  name={
                    flavorsTranslations.find(([f]) => f === field.value)?.[1] ??
                    t(BUILDER.DOCUMENT_FLAVOR_INFO)
                  }
                  flavor={field.value}
                />
              )}
              disableUnderline
            >
              {flavorsTranslations.map(([f, name]) => (
                <MenuItem
                  key={f}
                  value={f}
                  sx={{
                    margin: 1,
                    borderRadius: 2,
                    backgroundColor: getFlavorColor(
                      f as DocumentItemExtraFlavor,
                    ),
                    '&.Mui-selected': {
                      outline: ({ palette }) =>
                        `2px solid ${palette.primary.main}`,
                      backgroundColor: `${getFlavorColor(
                        f as DocumentItemExtraFlavor,
                      )} !important`,
                    },
                    '&:hover': {
                      outline: ({ palette }) =>
                        f !== DocumentItemExtraFlavor.None
                          ? `1px solid ${palette[f].main}`
                          : '1px solid gray',
                      backgroundColor: `${getFlavorColor(
                        f as DocumentItemExtraFlavor,
                      )} !important`,
                    },
                  }}
                >
                  <DocumentFlavorListElement name={name} flavor={f} />
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
    </Box>
  );
};
