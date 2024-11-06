import { useCallback, useState } from 'react';

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';

import { ShortLink } from '@graasp/sdk';

import CancelButton from '@/components/common/CancelButton';
import { SHORT_LINK_API_CALL_DEBOUNCE_MS } from '@/config/constants';
import { useBuilderTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import {
  SHORT_LINK_SAVE_BUTTON_ID,
  buildShortLinkCancelBtnId,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';
import { useDebouncedCallback } from '@/utils/useDebounce';

import AliasInput from './AliasInput';
import AliasValidation from './AliasValidation';

const { usePostShortLink, usePatchShortLink } = mutations;
const { useShortLinkAvailable } = hooks;

type Props = {
  itemId: string;
  initialAlias: string;
  platform: ShortLink['platform'];
  isNew: boolean;
  handleClose: () => void;
};

const ShortLinkDialogContent = ({
  itemId,
  initialAlias,
  platform,
  handleClose,
  isNew,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { mutateAsync: postShortLink, isPending: loadingPost } =
    usePostShortLink();
  const { mutateAsync: patchShortLink, isPending: loadingDelete } =
    usePatchShortLink();

  const DIALOG_TITLE = translateBuilder(
    isNew ? BUILDER.CREATE_SHORT_LINK_TITLE : BUILDER.EDIT_SHORT_LINK_TITLE,
  );

  const [alias, setAlias] = useState<string>(initialAlias);
  const [search, setSearch] = useState<string | undefined>();
  const [sendAPI, setSendAPI] = useState<string | undefined>();
  const [saved, setSaved] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isValidAlias, setIsValidAlias] = useState<boolean>(false);

  const setSendAPICallBack = useCallback(() => {
    // Avoid sending invalid alias format to the API
    if (isValidAlias) {
      setSendAPI(search);
    }
  }, [isValidAlias, search]);

  const { isDebounced } = useDebouncedCallback(
    setSendAPICallBack,
    SHORT_LINK_API_CALL_DEBOUNCE_MS,
  );
  const { data: shortLinkAvailable, isFetching: isAvailableLoading } =
    useShortLinkAvailable(sendAPI);

  const isLoading = isDebounced || isAvailableLoading;
  const mutateIsLoading = loadingDelete || loadingPost;
  const hasAliasChanged = isNew || (!saved && initialAlias !== alias);

  const enableSaveBtn =
    !hasError && hasAliasChanged && !isLoading && !mutateIsLoading;

  const handleSaveAlias = async () => {
    if (isNew) {
      await postShortLink({
        alias,
        platform,
        itemId,
      });
    } else {
      await patchShortLink({
        alias: initialAlias, // old alias name used to find the shortLink to patch
        shortLink: {
          alias,
        },
      });
    }

    setSaved(true);
    handleClose();
  };

  const onValidAlias = (isValid: boolean) => {
    setIsValidAlias(isValid);
    if (isValid && hasAliasChanged) {
      setSearch(alias);
    }
  };

  const MANAGE_SHORT_LINKS_ALERT_TITLE = `alert-title-manage-short-link-${alias}`;

  return (
    <>
      <DialogTitle id={MANAGE_SHORT_LINKS_ALERT_TITLE}>
        {DIALOG_TITLE}
      </DialogTitle>
      <DialogContent>
        <Stack direction="column" alignItems="left" spacing={2} mt={2}>
          <AliasInput alias={alias} onChange={setAlias} hasError={hasError} />

          <AliasValidation
            alias={alias}
            hasAliasChanged={hasAliasChanged}
            isAvailableLoading={isLoading}
            onValidAlias={onValidAlias}
            onError={setHasError}
            shortLinkAvailable={shortLinkAvailable}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <CancelButton
          onClick={handleClose}
          id={buildShortLinkCancelBtnId(alias)}
          disabled={mutateIsLoading}
        />
        <Button
          color="success"
          onClick={handleSaveAlias}
          disabled={!enableSaveBtn}
          id={SHORT_LINK_SAVE_BUTTON_ID}
        >
          {translateBuilder(BUILDER.SAVE_BTN)}
        </Button>
      </DialogActions>
    </>
  );
};

export default ShortLinkDialogContent;
