import PropTypes from 'prop-types';

import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../config/i18n';
import { useMutation } from '../../config/queryClient';
import { RESTORE_ITEMS_BUTTON_CLASS } from '../../config/selectors';

const RestoreButton = ({ itemIds, color, id }) => {
  const { t } = useBuilderTranslation();
  const { mutate: restoreItems } = useMutation(MUTATION_KEYS.RESTORE_ITEMS);

  const onClick = () => {
    // restore items
    restoreItems(itemIds);
  };

  const title = t(BUILDER.RESTORE_ITEM_BUTTON);

  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          id={id}
          aria-label={title}
          color={color}
          className={RESTORE_ITEMS_BUTTON_CLASS}
          onClick={onClick}
        >
          <RestoreFromTrashIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

RestoreButton.propTypes = {
  itemIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  color: PropTypes.string,
  id: PropTypes.string,
};
RestoreButton.defaultProps = {
  color: 'default',
  id: null,
};

export default RestoreButton;
