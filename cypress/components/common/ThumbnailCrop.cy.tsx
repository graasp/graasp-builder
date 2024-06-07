import ThumbnailCrop from '@/components/thumbnails/ThumbnailCrop';
import {
  CROP_MODAL_CONFIRM_BUTTON_ID,
  IMAGE_PLACEHOLDER_FOLDER,
  IMAGE_THUMBNAIL_FOLDER,
  IMAGE_THUMBNAIL_UPLOADER,
  REMOVE_THUMBNAIL_BUTTON,
  buildDataCyWrapper,
} from '@/config/selectors';

import {
  THUMBNAIL_MEDIUM_PATH,
  THUMBNAIL_SMALL_PATH,
} from '../../fixtures/thumbnails/links';

const ON_DELETE_SPY = 'onDelete';
const ON_UPLOAD_SPY = 'onUpload';
const getSpy = (spy: string) => `@${spy}`;
const eventHandler = {
  onUpload: (_payload: { thumbnail?: Blob }) => {},
  onDelete: () => {},
};

describe('<ThumbnailCrop />', () => {
  beforeEach(() => {
    cy.spy(eventHandler, 'onUpload').as(ON_UPLOAD_SPY);
    cy.spy(eventHandler, 'onDelete').as(ON_DELETE_SPY);
  });

  describe('Image is not set', () => {
    beforeEach(() => {
      cy.mount(
        <ThumbnailCrop
          thumbnailSize={120}
          setChanges={eventHandler.onUpload}
        />,
      );
    });

    it('Image element should not exist', () => {
      cy.get(buildDataCyWrapper(IMAGE_THUMBNAIL_FOLDER)).should('not.exist');
    });

    it('Image placeholder should be visible', () => {
      cy.get(buildDataCyWrapper(IMAGE_PLACEHOLDER_FOLDER)).should('be.visible');
    });

    it('Upload a new thumbnail', () => {
      // change item thumbnail
      // target visually hidden input
      cy.get(buildDataCyWrapper(IMAGE_THUMBNAIL_UPLOADER)).selectFile(
        THUMBNAIL_MEDIUM_PATH,
        // use force because the input is visually hidden
        { force: true },
      );
      cy.get(`#${CROP_MODAL_CONFIRM_BUTTON_ID}`).click();
      cy.get(getSpy(ON_UPLOAD_SPY)).should('be.calledOnce');
      cy.get(buildDataCyWrapper(IMAGE_PLACEHOLDER_FOLDER)).should('not.exist');
      cy.get(buildDataCyWrapper(IMAGE_THUMBNAIL_FOLDER)).should('be.visible');
    });
  });

  describe('Image is set', () => {
    beforeEach(() => {
      cy.mount(
        <ThumbnailCrop
          thumbnailSize={120}
          setChanges={eventHandler.onUpload}
          onDelete={eventHandler.onDelete}
          currentThumbnail={THUMBNAIL_MEDIUM_PATH}
        />,
      );
    });

    it('Image element should be visible', () => {
      cy.get(buildDataCyWrapper(IMAGE_THUMBNAIL_FOLDER)).should('be.visible');
    });

    it('Image placeholder should not exist', () => {
      cy.get(buildDataCyWrapper(IMAGE_PLACEHOLDER_FOLDER)).should('not.exist');
    });

    it('Upload a new thumbnail', () => {
      // change item thumbnail
      // target visually hidden input
      cy.get(buildDataCyWrapper(IMAGE_THUMBNAIL_UPLOADER)).selectFile(
        THUMBNAIL_SMALL_PATH,
        // use force because the input is visually hidden
        { force: true },
      );
      cy.get(`#${CROP_MODAL_CONFIRM_BUTTON_ID}`).click();
      cy.get(getSpy(ON_UPLOAD_SPY)).should('be.calledOnce');
      cy.get(buildDataCyWrapper(IMAGE_PLACEHOLDER_FOLDER)).should('not.exist');
      cy.get(buildDataCyWrapper(IMAGE_THUMBNAIL_FOLDER)).should('be.visible');
    });

    it('Remove a thumbnail', () => {
      cy.get(buildDataCyWrapper(REMOVE_THUMBNAIL_BUTTON)).click();
      cy.get(getSpy(ON_DELETE_SPY)).should('be.calledOnce');
      cy.get(buildDataCyWrapper(IMAGE_PLACEHOLDER_FOLDER)).should('be.visible');
      cy.get(buildDataCyWrapper(IMAGE_THUMBNAIL_FOLDER)).should('not.exist');
    });
  });
});
