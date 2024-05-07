import { SelectProps } from '@mui/material';

import {
  PackedItem,
  PermissionLevel,
  PermissionLevelCompare,
} from '@graasp/sdk';
import { langs } from '@graasp/translations';
import { Select } from '@graasp/ui';

import { mutations } from '@/config/queryClient';
import { LANGUAGE_SELECTOR_ID } from '@/config/selectors';

const LanguageSelect = ({ item }: { item: PackedItem }): JSX.Element => {
  const { mutate: changeLang } = mutations.useEditItem();

  const canWrite = item.permission
    ? PermissionLevelCompare.gte(item.permission, PermissionLevel.Write)
    : false;

  const onChange: SelectProps['onChange'] = (e) => {
    const { value: newLang } = e.target;
    changeLang({ id: item.id, lang: newLang as string });
  };

  const values = Object.entries(langs).map(([k, v]) => ({ value: k, text: v }));

  return (
    <Select
      id={LANGUAGE_SELECTOR_ID}
      disabled={!canWrite}
      size="small"
      values={values}
      value={item.lang}
      sx={{ fontSize: '14px' }}
      onChange={onChange}
    />
  );
};

export default LanguageSelect;
